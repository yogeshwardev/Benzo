import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateCertificate(enrollmentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.progress < 100) {
      throw new BadRequestException('Course must be completed to generate certificate');
    }

    if (enrollment.certificateId) {
      throw new BadRequestException('Certificate already generated');
    }

    // Generate unique certificate ID
    const certificateId = uuidv4().toUpperCase().replace(/-/g, '').substring(0, 12);

    // Generate verification URL
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-certificate/${certificateId}`;

    // Generate QR code
    const qrCodeUrl = await this.generateQRCode(verificationUrl);

    // Create certificate
    const certificate = await this.prisma.certificate.create({
      data: {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        certificateId,
        verificationUrl,
        qrCodeUrl,
      },
    });

    // Update enrollment
    await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { certificateId: certificate.id },
    });

    return certificate;
  }

  async getCertificate(certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async verifyCertificate(certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      return { valid: false, message: 'Certificate not found' };
    }

    return {
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.user.name,
        studentEmail: certificate.user.email,
        courseName: certificate.course.title,
        issueDate: certificate.issueDate,
        verificationUrl: certificate.verificationUrl,
      },
    };
  }

  async getUserCertificates(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
        orderBy: { issueDate: 'desc' },
      }),
      this.prisma.certificate.count({ where: { userId } }),
    ]);

    return {
      data: certificates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async downloadCertificate(certificateId: string, userId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        user: true,
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.userId !== userId) {
      throw new BadRequestException('You can only download your own certificates');
    }

    // Generate PDF
    const pdfBuffer = await this.generatePDF(certificate);

    return {
      buffer: pdfBuffer,
      filename: `certificate-${certificate.certificateId}.pdf`,
      contentType: 'application/pdf',
    };
  }

  private async generateQRCode(url: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url);
      return qrCodeDataUrl;
    } catch (error) {
      throw new BadRequestException('Failed to generate QR code');
    }
  }

  private async generatePDF(certificate: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Design the certificate
        doc.fontSize(40).font('Helvetica-Bold').text('Certificate of Completion', {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(16).text('This is to certify that', { align: 'center' });

        doc.moveDown();
        doc.fontSize(24).font('Helvetica-Bold').text(certificate.user.name, {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(16).text('has successfully completed the course', { align: 'center' });

        doc.moveDown();
        doc.fontSize(20).font('Helvetica-Bold').text(certificate.course.title, {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(14).text(`Instructor: ${certificate.course.instructor.name}`, {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(12).text(`Issued on: ${certificate.issueDate.toLocaleDateString()}`, {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(10).text(`Certificate ID: ${certificate.certificateId}`, {
          align: 'center',
        });

        doc.moveDown();
        doc.fontSize(10).text(`Verify at: ${certificate.verificationUrl}`, {
          align: 'center',
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async revokeCertificate(certificateId: string, userId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.userId !== userId) {
      throw new BadRequestException('You can only revoke your own certificates');
    }

    await this.prisma.certificate.delete({
      where: { id: certificate.id },
    });

    // Update enrollment
    await this.prisma.enrollment.updateMany({
      where: { certificateId: certificate.id },
      data: { certificateId: null },
    });

    return { message: 'Certificate revoked successfully' };
  }
}
