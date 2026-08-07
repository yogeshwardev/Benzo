import { Controller, Get, Post, Delete, UseGuards, Request, Query, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Post('enrollments/:enrollmentId')
  async generateCertificate(@Param('enrollmentId') enrollmentId: string) {
    return this.certificatesService.generateCertificate(enrollmentId);
  }

  @Get('verify/:certificateId')
  async verifyCertificate(@Param('certificateId') certificateId: string) {
    return this.certificatesService.verifyCertificate(certificateId);
  }

  @Get('my-certificates')
  async getUserCertificates(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.certificatesService.getUserCertificates(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('download/:certificateId')
  async downloadCertificate(@Param('certificateId') certificateId: string, @Request() req, @Res() res: Response) {
    const { buffer, filename, contentType } = await this.certificatesService.downloadCertificate(certificateId, req.user.id);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  @Delete('revoke/:certificateId')
  async revokeCertificate(@Param('certificateId') certificateId: string, @Request() req) {
    return this.certificatesService.revokeCertificate(certificateId, req.user.id);
  }
}
