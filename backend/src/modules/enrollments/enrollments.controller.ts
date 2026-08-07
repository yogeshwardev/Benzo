import { Controller, Get, Post, Delete, Param, UseGuards, Request, Query, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post('courses/:courseId')
  async enrollInCourse(
    @Param('courseId') courseId: string,
    @Request() req,
    @Body() body?: { couponCode?: string; useWallet?: boolean },
  ) {
    return this.enrollmentsService.enrollInCourse(req.user.id, courseId, body);
  }

  @Get()
  async getEnrollments(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.enrollmentsService.getEnrollments(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('continue-learning')
  async getContinueLearning(@Request() req) {
    return this.enrollmentsService.getContinueLearning(req.user.id);
  }

  @Get('completed')
  async getCompletedCourses(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.enrollmentsService.getCompletedCourses(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  async getEnrollmentById(@Param('id') id: string, @Request() req) {
    return this.enrollmentsService.getEnrollmentById(id, req.user.id);
  }

  @Delete('courses/:courseId')
  async unenrollFromCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.unenrollFromCourse(courseId, req.user.id);
  }
}
