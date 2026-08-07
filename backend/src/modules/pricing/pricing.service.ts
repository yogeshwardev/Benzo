import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { DiscountType } from '@skillforge/shared';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate final price for a course with all applicable discounts
   */
  async calculateFinalPrice(courseId: string, options?: {
    couponCode?: string;
    useWallet?: boolean;
    userId?: string;
  }) {
    // Get course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    let finalPrice = course.price;
    let discountAmount = 0;
    let walletAmountUsed = 0;
    let appliedCoupons: any[] = [];

    // Apply coupon if provided
    if (options?.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: options.couponCode },
      });

      if (coupon && this.isCouponValid(coupon, courseId, course.price)) {
        const couponDiscount = this.calculateCouponDiscount(coupon, course.price);
        discountAmount += couponDiscount;
        finalPrice -= couponDiscount;
        appliedCoupons.push({
          code: coupon.code,
          discount: couponDiscount,
          type: coupon.discountType,
        });
      }
    }

    // Use wallet if requested
    if (options?.useWallet && options?.userId && finalPrice > 0) {
      const wallet = await this.prisma.wallet.findUnique({
        where: { userId: options.userId },
      });

      if (wallet && wallet.balance > 0) {
        const amountToUse = Math.min(wallet.balance, finalPrice);
        walletAmountUsed = amountToUse;
        finalPrice -= amountToUse;
      }
    }

    // Ensure price doesn't go negative
    finalPrice = Math.max(0, finalPrice);

    return {
      originalPrice: course.price,
      finalPrice,
      discountAmount,
      walletAmountUsed,
      appliedCoupons,
      totalSavings: discountAmount + walletAmountUsed,
    };
  }

  /**
   * Validate coupon applicability
   */
  private isCouponValid(coupon: any, courseId: string, originalPrice: number): boolean {
    // Check if coupon is active
    if (!coupon.isActive) {
      return false;
    }

    // Check if coupon has expired
    if (coupon.expiryDate < new Date()) {
      return false;
    }

    // Check if usage limit reached
    if (coupon.usedCount >= coupon.usageLimit) {
      return false;
    }

    // Check if coupon is applicable for this course
    if (coupon.courseId && coupon.courseId !== courseId) {
      return false;
    }

    // Check minimum purchase requirement
    if (coupon.minPurchase && originalPrice < coupon.minPurchase) {
      return false;
    }

    return true;
  }

  /**
   * Calculate discount amount from coupon
   */
  private calculateCouponDiscount(coupon: any, originalPrice: number): number {
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

    return discount;
  }

  /**
   * Calculate instructor earnings from course sale
   */
  async calculateInstructorEarnings(courseId: string, saleAmount: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    // Default platform fee is 20%
    const platformFeePercentage = course.platformFeePercentage || 20;
    const platformFee = Math.round((saleAmount * platformFeePercentage) / 100);
    const instructorEarnings = saleAmount - platformFee;

    return {
      saleAmount,
      platformFeePercentage,
      platformFee,
      instructorEarnings,
    };
  }

  /**
   * Calculate refund amount based on policy
   */
  async calculateRefundAmount(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        course: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Refund policy: 100% refund within 7 days, 50% within 14 days, no refund after 14 days
    const daysSincePurchase = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    let refundPercentage = 0;

    if (daysSincePurchase <= 7) {
      refundPercentage = 100;
    } else if (daysSincePurchase <= 14) {
      refundPercentage = 50;
    }

    const refundAmount = Math.round((order.finalAmount * refundPercentage) / 100);

    return {
      orderAmount: order.finalAmount,
      daysSincePurchase,
      refundPercentage,
      refundAmount,
      canRefund: refundPercentage > 0,
    };
  }

  /**
   * Get pricing breakdown for a course
   */
  async getPricingBreakdown(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        coupons: {
          where: {
            isActive: true,
            expiryDate: {
              gte: new Date(),
            },
          },
          take: 5,
        },
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    // Calculate potential savings with best coupon
    let bestCoupon = null;
    let maxDiscount = 0;

    for (const coupon of course.coupons) {
      const discount = this.calculateCouponDiscount(coupon, course.price);
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestCoupon = coupon;
      }
    }

    return {
      originalPrice: course.price,
      bestCoupon: bestCoupon ? {
        code: bestCoupon.code,
        discount: maxDiscount,
        type: bestCoupon.discountType,
      } : null,
      maxDiscount,
      bestPrice: course.price - maxDiscount,
      platformFeePercentage: course.platformFeePercentage || 20,
    };
  }
}
