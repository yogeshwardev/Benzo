import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { LiveClassesService } from './live-classes.service';

@Controller('live-classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiveClassesController {
  constructor(private liveClassesService: LiveClassesService) {}

  @Post('courses/:courseId')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async createLiveClass(@Param('courseId') courseId: string, @Request() req, @Body() body: any) {
    return this.liveClassesService.createLiveClass(courseId, req.user.id, body);
  }

  @Get('courses/:courseId')
  async getLiveClasses(@Param('courseId') courseId: string, @Request() req) {
    return this.liveClassesService.getLiveClasses(courseId, req.user.id);
  }

  @Get('upcoming')
  async getUpcomingLiveClasses(@Request() req) {
    return this.liveClassesService.getUpcomingLiveClasses(req.user.id);
  }

  @Get('instructor/my-classes')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorLiveClasses(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.liveClassesService.getInstructorLiveClasses(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  async getLiveClassById(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.getLiveClassById(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async updateLiveClass(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.liveClassesService.updateLiveClass(id, req.user.id, body);
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteLiveClass(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.deleteLiveClass(id, req.user.id);
  }

  @Post(':id/start')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async startLiveClass(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.startLiveClass(id, req.user.id);
  }

  @Post(':id/end')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async endLiveClass(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.endLiveClass(id, req.user.id);
  }

  @Post(':id/join')
  async joinLiveClass(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.joinLiveClass(id, req.user.id);
  }

  @Post(':id/leave')
  async leaveLiveClass(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.leaveLiveClass(id, req.user.id);
  }

  @Get(':id/attendance')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getLiveClassAttendance(@Param('id') id: string, @Request() req) {
    return this.liveClassesService.getLiveClassAttendance(id, req.user.id);
  }
}
