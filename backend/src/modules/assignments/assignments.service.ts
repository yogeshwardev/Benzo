import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@skillforge/shared';

@Injectable()
export class AssignmentsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
      },
      region: 'auto',
    });
    this.bucketName = this.configService.get('R2_BUCKET_NAME');
  }

  async createAssignment(courseId: string, userId: string, data: any, files?: Express.Multer.File[]) {
    // Check if user owns the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only create assignments for your own courses');
    }

    // Upload files if provided
    const attachments = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.uploadFile(file);
        attachments.push(url);
      }
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        ...data,
        courseId,
        attachments: attachments.length > 0 ? attachments : data.attachments || [],
      },
    });

    return assignment;
  }

  async getAssignments(courseId: string, userId: string) {
    // Check if user is enrolled or is instructor
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!isEnrolled && course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view assignments');
    }

    const assignments = await this.prisma.assignment.findMany({
      where: { courseId },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    // Add submission status for students
    if (course.instructorId !== userId) {
      const submissions = await this.prisma.assignmentSubmission.findMany({
        where: {
          userId,
          assignmentId: { in: assignments.map((a) => a.id) },
        },
      });

      const submissionMap = new Map(
        submissions.map((s) => [s.assignmentId, s]),
      );

      return assignments.map((assignment) => ({
        ...assignment,
        submission: submissionMap.get(assignment.id) || null,
      }));
    }

    return assignments;
  }

  async getAssignmentById(assignmentId: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if user is enrolled or is instructor
    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: assignment.courseId,
        },
      },
    });

    if (!isEnrolled && assignment.course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view this assignment');
    }

    // If student, only show their submission
    if (assignment.course.instructorId !== userId) {
      assignment.submissions = assignment.submissions.filter(
        (s) => s.userId === userId,
      );
    }

    return assignment;
  }

  async updateAssignment(assignmentId: string, userId: string, data: any, files?: Express.Multer.File[]) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own assignments');
    }

    // Upload new files if provided
    const attachments = [...(assignment.attachments || [])];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.uploadFile(file);
        attachments.push(url);
      }
    }

    const updatedAssignment = await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        ...data,
        attachments,
      },
    });

    return updatedAssignment;
  }

  async deleteAssignment(assignmentId: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own assignments');
    }

    // Delete files
    if (assignment.attachments && assignment.attachments.length > 0) {
      for (const url of assignment.attachments) {
        await this.deleteFile(url);
      }
    }

    await this.prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return { message: 'Assignment deleted successfully' };
  }

  async submitAssignment(assignmentId: string, userId: string, files: Express.Multer.File[]) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: assignment.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to submit assignments');
    }

    // Check if already submitted
    const existingSubmission = await this.prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId,
        },
      },
    });

    if (existingSubmission) {
      throw new BadRequestException('You have already submitted this assignment');
    }

    // Upload files
    const uploadedFiles = [];
    for (const file of files) {
      const url = await this.uploadFile(file);
      uploadedFiles.push(url);
    }

    const submission = await this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        files: uploadedFiles,
      },
    });

    return submission;
  }

  async gradeSubmission(submissionId: string, userId: string, data: { marks: number; feedback: string }) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.assignment.course.instructorId !== userId) {
      throw new ForbiddenException('You can only grade submissions for your own courses');
    }

    if (data.marks > submission.assignment.maxMarks) {
      throw new BadRequestException('Marks cannot exceed maximum marks');
    }

    const gradedSubmission = await this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marks: data.marks,
        feedback: data.feedback,
        reviewedAt: new Date(),
      },
    });

    return gradedSubmission;
  }

  async getStudentSubmissions(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.prisma.assignmentSubmission.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          assignment: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.assignmentSubmission.count({ where: { userId } }),
    ]);

    return {
      data: submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `assignments/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${this.configService.get('R2_ENDPOINT')}/${this.bucketName}/${key}`;
  }

  private async deleteFile(url: string): Promise<void> {
    const key = url.split('/').pop();
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `assignments/${key}`,
    });

    await this.s3Client.send(command);
  }
}
