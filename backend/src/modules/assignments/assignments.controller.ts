import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post('courses/:courseId')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 5))
  async createAssignment(
    @Param('courseId') courseId: string,
    @Request() req,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.assignmentsService.createAssignment(courseId, req.user.id, body, files);
  }

  @Get('courses/:courseId')
  async getAssignments(@Param('courseId') courseId: string, @Request() req) {
    return this.assignmentsService.getAssignments(courseId, req.user.id);
  }

  @Get(':id')
  async getAssignmentById(@Param('id') id: string, @Request() req) {
    return this.assignmentsService.getAssignmentById(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 5))
  async updateAssignment(
    @Param('id') id: string,
    @Request() req,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.assignmentsService.updateAssignment(id, req.user.id, body, files);
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteAssignment(@Param('id') id: string, @Request() req) {
    return this.assignmentsService.deleteAssignment(id, req.user.id);
  }

  @Post(':id/submit')
  @UseInterceptors(FilesInterceptor('files', 5))
  async submitAssignment(
    @Param('id') id: string,
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.assignmentsService.submitAssignment(id, req.user.id, files);
  }

  @Put('submissions/:submissionId/grade')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Request() req,
    @Body() body: { marks: number; feedback: string },
  ) {
    return this.assignmentsService.gradeSubmission(submissionId, req.user.id, body);
  }

  @Get('student/my-submissions')
  async getStudentSubmissions(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.assignmentsService.getStudentSubmissions(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }
}
