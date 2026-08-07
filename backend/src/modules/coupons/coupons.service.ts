import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRole, DiscountType } from '@skillforge/shared';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async createCoupon(userId: string, data: any) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create coupons');
    }

    // Check if coupon code already exists
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });

    return coupon;
  }

  async getCoupons(page: number = 1, limit: number = 10, isActive?: boolean) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCouponById(couponId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
          },
        },
      });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async getCouponByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    return coupon;
  }

  async updateCoupon(couponId: string, userId: string, data: any) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update coupons');
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: { id: couponId },
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return updatedCoupon;
  }

  async deleteCoupon(couponId: string, userId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete coupons');
    }

    await this.prisma.coupon.delete({
      where: { id: couponId },
    });

    return { message: 'Coupon deleted successfully' };
  }

  async applyCoupon(code: string, courseId: string, originalPrice: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is not active');
    }

    if (coupon.expiryDate < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.courseId && coupon.courseId !== courseId) {
      throw new BadRequestException('Coupon is not applicable for this course');
    }

    if (coupon.minPurchase && originalPrice < coupon.minPurchase) {
      throw new BadRequestException(`Minimum purchase amount is ${coupon.minPurchase}`);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === DiscountType.FLAT) {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((originalPrice * coupon.discountValue) / 100);
    }

    // Apply max discount limit
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      finalPrice: originalPrice - discount,
    };
  }

  async validateCoupon(code: string, courseId: string, userId?: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        course: true,
      },
    });

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is not active' };
    }

    // Check if coupon has expired
    if (coupon.expiryDate < new Date()) {
      return { valid: false, message: 'Coupon has expired' };
    }

    // Check if usage limit reached
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    // Check if coupon is applicable for this course
    if (coupon.courseId && coupon.courseId !== courseId) {
      return { valid: false, message: 'Coupon is not applicable for this course' };
    }

    // Check if user has already used this coupon (if userId provided)
    if (userId) {
      const existingOrder = await this.prisma.order.findFirst({
        where: {
          userId,
          couponId: coupon.id,
          status: 'COMPLETED',
        },
      });

      if (existingOrder) {
        return { valid: false, message: 'You have already used this coupon' };
      }
    }

    // Check if course price meets minimum purchase requirement
    if (coupon.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (course && coupon.minPurchase && course.price < coupon.minPurchase) {
        return { valid: false, message: `Minimum purchase amount is ₹${coupon.minPurchase}` };
      }
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        expiryDate: coupon.expiryDate,
        minPurchase: coupon.minPurchase,
        applicableCourse: coupon.course?.title || 'All courses',
      },
    };
  }
}
