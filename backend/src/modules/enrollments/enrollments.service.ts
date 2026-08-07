import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { WalletService } from '../wallet/wallet.service';
import { PricingService } from '../pricing/pricing.service';
import { UserRole } from '@skillforge/shared';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
    private walletService: WalletService,
    private pricingService: PricingService,
  ) {}

  async enrollInCourse(userId: string, courseId: string, options?: {
    couponCode?: string;
    useWallet?: boolean;
  }) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.isPublished) {
      throw new BadRequestException('Course is not available for enrollment');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('You are already enrolled in this course');
    }

    // Calculate final price using pricing service
    const pricingResult = await this.pricingService.calculateFinalPrice(courseId, {
      couponCode: options?.couponCode,
      useWallet: options?.useWallet,
      userId,
    });

    const finalPrice = pricingResult.finalPrice;
    const discountAmount = pricingResult.discountAmount;
    const walletAmountUsed = pricingResult.walletAmountUsed;

    // Deduct from wallet if used
    if (walletAmountUsed > 0) {
      await this.walletService.deductFromWallet(userId, walletAmountUsed, 'Course enrollment');
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update course enrollment count
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        enrollmentCount: {
          increment: 1,
        },
      },
    });

    return {
      enrollment,
      originalPrice: course.price,
      discountAmount,
      walletAmountUsed,
      finalPrice,
    };
  }

  async getEnrollments(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.enrollment.count({ where: { userId } }),
    ]);

    return {
      data: enrollments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getEnrollmentById(enrollmentId: string, userId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new BadRequestException('You can only view your own enrollments');
    }

    // Get lesson progress
    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: {
          in: enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
        },
      },
    });

    return {
      ...enrollment,
      lessonProgress,
    };
  }

  async unenrollFromCourse(courseId: string, userId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    await this.prisma.enrollment.delete({
      where: { id: enrollment.id },
    });

    // Update course enrollment count
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        enrollmentCount: {
          decrement: 1,
        },
      },
    });

    return { message: 'Successfully unenrolled from course' };
  }

  async getContinueLearning(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
        progress: {
          gt: 0,
          lt: 100,
        },
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5,
    });

    return enrollments;
  }

  async getCompletedCourses(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: {
          userId,
          completedAt: {
            not: null,
          },
        },
        skip,
        take: limit,
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          certificate: true,
        },
        orderBy: { completedAt: 'desc' },
      }),
      this.prisma.enrollment.count({
        where: {
          userId,
          completedAt: {
            not: null,
          },
        },
      }),
    ]);

    return {
      data: enrollments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
