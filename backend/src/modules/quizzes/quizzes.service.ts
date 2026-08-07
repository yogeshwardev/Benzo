import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRole, QuestionType } from '@skillforge/shared';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(courseId: string, userId: string, data: any) {
    // Check if user owns the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }

    const { questions, ...quizData } = data;

    const quiz = await this.prisma.quiz.create({
      data: {
        ...quizData,
        courseId,
        questions: {
          create: questions.map((q: any, index: number) => ({
            ...q,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return quiz;
  }

  async getQuizzes(courseId: string, userId: string) {
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
      throw new ForbiddenException('You must be enrolled to view quizzes');
    }

    const quizzes = await this.prisma.quiz.findMany({
      where: { courseId },
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Hide questions from students (only show quiz info)
    if (course.instructorId !== userId) {
      return quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        _count: quiz._count,
      }));
    }

    return quizzes;
  }

  async getQuizById(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is enrolled or is instructor
    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.courseId,
        },
      },
    });

    if (!isEnrolled && quiz.course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view this quiz');
    }

    // Hide correct answers from students
    if (quiz.course.instructorId !== userId) {
      quiz.questions = quiz.questions.map((q) => ({
        ...q,
        correctAnswer: undefined,
        explanation: undefined,
      }));
    }

    return quiz;
  }

  async updateQuiz(quizId: string, userId: string, data: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own quizzes');
    }

    const { questions, ...quizData } = data;

    // Delete existing questions
    await this.prisma.quizQuestion.deleteMany({
      where: { quizId },
    });

    // Update quiz and create new questions
    const updatedQuiz = await this.prisma.quiz.update({
      where: { id: quizId },
      data: {
        ...quizData,
        questions: {
          create: questions.map((q: any, index: number) => ({
            ...q,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return updatedQuiz;
  }

  async deleteQuiz(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own quizzes');
    }

    await this.prisma.quiz.delete({
      where: { id: quizId },
    });

    return { message: 'Quiz deleted successfully' };
  }

  async attemptQuiz(quizId: string, userId: string, data: { answers: Record<string, string>; timeTaken: number }) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        course: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to attempt quizzes');
    }

    // Check if already attempted
    const existingAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        quizId,
        userId,
      },
    });

    if (existingAttempt) {
      throw new BadRequestException('You have already attempted this quiz');
    }

    // Calculate marks
    let marks = 0;
    const answers = data.answers;

    for (const question of quiz.questions) {
      if (answers[question.id] === question.correctAnswer) {
        marks += question.marks;
      }
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        answers: answers as any,
        marks,
        timeTaken: data.timeTaken,
      },
    });

    return {
      attempt,
      totalMarks: quiz.totalMarks,
      passingMarks: quiz.passingMarks,
      passed: marks >= quiz.passingMarks,
    };
  }

  async getQuizAttempts(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // If instructor, show all attempts
    if (quiz.course.instructorId === userId) {
      const attempts = await this.prisma.quizAttempt.findMany({
        where: { quizId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { completedAt: 'desc' },
      });

      return attempts;
    }

    // If student, show only their attempts
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId,
        userId,
      },
      orderBy: { completedAt: 'desc' },
    });

    return attempts;
  }

  async getLeaderboard(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is enrolled or is instructor
    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: quiz.courseId,
        },
      },
    });

    if (!isEnrolled && quiz.course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view the leaderboard');
    }

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: [{ marks: 'desc' }, { timeTaken: 'asc' }],
    });

    // Remove duplicate users (keep best attempt)
    const bestAttempts = new Map();
    for (const attempt of attempts) {
      const existing = bestAttempts.get(attempt.userId);
      if (!existing || attempt.marks > existing.marks || (attempt.marks === existing.marks && attempt.timeTaken < existing.timeTaken)) {
        bestAttempts.set(attempt.userId, attempt);
      }
    }

    return Array.from(bestAttempts.values()).map((attempt, index) => ({
      rank: index + 1,
      ...attempt,
    }));
  }

  async getStudentQuizResults(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      this.prisma.quizAttempt.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          quiz: {
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
        orderBy: { completedAt: 'desc' },
      }),
      this.prisma.quizAttempt.count({ where: { userId } }),
    ]);

    return {
      data: attempts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
