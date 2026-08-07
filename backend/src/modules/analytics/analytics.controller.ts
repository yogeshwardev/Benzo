import { Controller, Get, UseGuards, Request, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  async getAnalytics(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      : undefined;

    return this.analyticsService.getAnalytics(req.user.id, dateRange);
  }

  @Get('courses/:courseId')
  async getCourseAnalytics(@Param('courseId') courseId: string, @Request() req) {
    return this.analyticsService.getCourseAnalytics(courseId, req.user.id);
  }

  @Get('student/me')
  async getStudentAnalytics(@Request() req) {
    return this.analyticsService.getStudentAnalytics(req.user.id);
  }
}
