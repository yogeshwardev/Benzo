import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Post('courses/:courseId')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async createQuiz(@Param('courseId') courseId: string, @Request() req, @Body() body: any) {
    return this.quizzesService.createQuiz(courseId, req.user.id, body);
  }

  @Get('courses/:courseId')
  async getQuizzes(@Param('courseId') courseId: string, @Request() req) {
    return this.quizzesService.getQuizzes(courseId, req.user.id);
  }

  @Get(':id')
  async getQuizById(@Param('id') id: string, @Request() req) {
    return this.quizzesService.getQuizById(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async updateQuiz(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.quizzesService.updateQuiz(id, req.user.id, body);
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteQuiz(@Param('id') id: string, @Request() req) {
    return this.quizzesService.deleteQuiz(id, req.user.id);
  }

  @Post(':id/attempt')
  async attemptQuiz(@Param('id') id: string, @Request() req, @Body() body: { answers: Record<string, string>; timeTaken: number }) {
    return this.quizzesService.attemptQuiz(id, req.user.id, body);
  }

  @Get(':id/attempts')
  async getQuizAttempts(@Param('id') id: string, @Request() req) {
    return this.quizzesService.getQuizAttempts(id, req.user.id);
  }

  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') id: string, @Request() req) {
    return this.quizzesService.getLeaderboard(id, req.user.id);
  }

  @Get('student/my-results')
  async getStudentQuizResults(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.quizzesService.getStudentQuizResults(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }
}
