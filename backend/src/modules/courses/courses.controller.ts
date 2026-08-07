import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@skillforge/shared';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  async getAllCourses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
    @Query('instructorId') instructorId?: string,
  ) {
    return this.coursesService.getAllCourses({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      difficulty,
      search,
      instructorId,
    });
  }

  @Public()
  @Get('categories')
  async getCategories() {
    return this.coursesService.getCategories();
  }

  @Public()
  @Get(':id')
  async getCourseById(@Param('id') id: string, @Request() req) {
    return this.coursesService.getCourseById(id, req.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async createCourse(@Request() req, @Body() body: any) {
    return this.coursesService.createCourse(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async updateCourse(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.coursesService.updateCourse(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.deleteCourse(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async publishCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.publishCourse(id, req.user.id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async unpublishCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.unpublishCourse(id, req.user.id);
  }

  @Get('instructor/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorCourses(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.coursesService.getInstructorCourses(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }
}
