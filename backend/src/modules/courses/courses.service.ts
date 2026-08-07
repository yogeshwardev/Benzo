import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CacheService } from '../../common/services/cache.service';
import { UserRole, Difficulty } from '@skillforge/shared';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async createCourse(userId: string, data: any) {
    const course = await this.prisma.course.create({
      data: {
        ...data,
        instructorId: userId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return course;
  }

  async getAllCourses(params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    search?: string;
    instructorId?: string;
  }) {
    const { page = 1, limit = 10, category, difficulty, search, instructorId } = params;
    const skip = (page - 1) * limit;

    // Generate cache key
    const cacheKey = CacheService.keys.courses(
      JSON.stringify({ page, limit, category, difficulty, search, instructorId })
    );

    // Try to get from cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty as Difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              modules: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    const result = {
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, 300000);

    return result;
  }

  async getCourseById(courseId: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let enrollment = null;

    if (userId) {
      enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      isEnrolled = !!enrollment;
    }

    // Hide non-preview lessons if not enrolled
    if (!isEnrolled && course.modules) {
      course.modules = course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.filter((lesson) => lesson.isPreview),
      }));
    }

    return {
      ...course,
      isEnrolled,
      enrollment,
    };
  }

  async updateCourse(courseId: string, userId: string, data: any) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return updatedCourse;
  }

  async deleteCourse(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
  }

  async getInstructorCourses(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: { instructorId: userId },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              modules: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where: { instructorId: userId } }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async publishCourse(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only publish your own courses');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    });

    return updatedCourse;
  }

  async unpublishCourse(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only unpublish your own courses');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: { isPublished: false },
    });

    return updatedCourse;
  }

  async getCategories() {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });

    return courses.map((course) => course.category);
  }
}
