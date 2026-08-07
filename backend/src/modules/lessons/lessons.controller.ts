import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { LessonsService } from './lessons.service';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('video'))
  async createLesson(
    @Body() body: { moduleId: string } & any,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.lessonsService.createLesson(body.moduleId, req.user.id, body, file);
  }

  @Get(':id')
  async getLessonById(@Param('id') id: string, @Request() req) {
    return this.lessonsService.getLessonById(id, req.user?.id);
  }

  @Put(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('video'))
  async updateLesson(
    @Param('id') id: string,
    @Request() req,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.lessonsService.updateLesson(id, req.user.id, body, file);
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteLesson(@Param('id') id: string, @Request() req) {
    return this.lessonsService.deleteLesson(id, req.user.id);
  }

  @Post(':id/resources')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async addResource(
    @Param('id') id: string,
    @Request() req,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.lessonsService.addResource(id, req.user.id, body, file);
  }

  @Delete('resources/:resourceId')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteResource(@Param('resourceId') resourceId: string, @Request() req) {
    return this.lessonsService.deleteResource(resourceId, req.user.id);
  }

  @Put(':id/progress')
  async updateProgress(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.lessonsService.updateProgress(id, req.user.id, body);
  }
}
