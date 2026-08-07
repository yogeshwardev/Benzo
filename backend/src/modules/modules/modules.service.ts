import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRole } from '@skillforge/shared';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async createModule(courseId: string, userId: string, data: any) {
    // Check if user owns the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only add modules to your own courses');
    }

    // Get the next order number
    const lastModule = await this.prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });

    const order = lastModule ? lastModule.order + 1 : 1;

    const module = await this.prisma.module.create({
      data: {
        ...data,
        courseId,
        order,
      },
      include: {
        lessons: true,
      },
    });

    // Update course total modules
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        totalModules: {
          increment: 1,
        },
      },
    });

    return module;
  }

  async getModuleById(moduleId: string, userId?: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Check if user is enrolled
    let isEnrolled = false;
    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: module.courseId,
          },
        },
      });
      isEnrolled = !!enrollment;
    }

    // Hide non-preview lessons if not enrolled
    if (!isEnrolled && module.lessons) {
      module.lessons = module.lessons.filter((lesson) => lesson.isPreview);
    }

    return module;
  }

  async updateModule(moduleId: string, userId: string, data: any) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own modules');
    }

    const updatedModule = await this.prisma.module.update({
      where: { id: moduleId },
      data,
      include: {
        lessons: true,
      },
    });

    return updatedModule;
  }

  async deleteModule(moduleId: string, userId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own modules');
    }

    await this.prisma.module.delete({
      where: { id: moduleId },
    });

    // Update course total modules
    await this.prisma.course.update({
      where: { id: module.courseId },
      data: {
        totalModules: {
          decrement: 1,
        },
      },
    });

    return { message: 'Module deleted successfully' };
  }

  async reorderModule(moduleId: string, userId: string, newOrder: number) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only reorder your own modules');
    }

    // Update the module order
    await this.prisma.module.update({
      where: { id: moduleId },
      data: { order: newOrder },
    });

    return { message: 'Module reordered successfully' };
  }
}
