import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
const Razorpay = require('razorpay');
import { OrderStatus, ReferenceType } from '@skillforge/shared';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CouponsService } from '../coupons/coupons.service';
import { WalletService } from '../wallet/wallet.service';
import { ReferralsService } from '../referrals/referrals.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private enrollmentsService: EnrollmentsService,
    private couponsService: CouponsService,
    private walletService: WalletService,
    private referralsService: ReferralsService,
    private pricingService: PricingService,
  ) {
    this.razorpay = new (Razorpay as any)({
      key_id: this.configService.get('RAZORPAY_KEY_ID') || 'rzp_test_dummy',
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET') || 'dummy_secret',
    });
  }

  async createOrder(userId: string, courseId: string, options?: {
    couponCode?: string;
    useWallet?: boolean;
    paymentMethod?: string;
  }) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
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
      throw new BadRequestException('You are already enrolled in this course');
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

    // If final price is 0, enroll directly
    if (finalPrice <= 0) {
      await this.enrollmentsService.enrollInCourse(userId, courseId, {
        couponCode: options?.couponCode,
        useWallet: options?.useWallet,
      });

      return {
        id: 'free-enrollment',
        amount: 0,
        currency: 'INR',
        status: 'completed',
        message: 'Enrolled successfully',
      };
    }

    // Create Razorpay order
    const razorpayOrder = await this.razorpay.orders.create({
      amount: finalPrice * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${userId}_${courseId}_${Date.now()}`,
      notes: {
        userId,
        courseId,
        couponCode: options?.couponCode || '',
        useWallet: options?.useWallet ? 'true' : 'false',
      },
    });

    // Create order in database
    const order = await this.prisma.order.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        currency: 'INR',
        status: OrderStatus.PENDING,
        paymentMethod: options?.paymentMethod || 'razorpay',
        razorpayOrderId: razorpayOrder.id,
        couponId: options?.couponCode ? (await this.couponsService.getCouponByCode(options.couponCode))?.id : null,
        discountAmount,
        walletAmountUsed,
        finalAmount: finalPrice,
      },
    });

    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: this.configService.get('RAZORPAY_KEY_ID'),
      orderId: order.id,
      discountAmount,
      walletAmountUsed,
      finalPrice,
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string) {
    // Get order from database
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        course: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Payment already verified');
    }

    // Verify signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET'))
      .update(`${order.razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Get payment details from Razorpay
    const payment = await this.razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      throw new BadRequestException('Payment not successful');
    }

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.COMPLETED,
        razorpayPaymentId: paymentId,
      },
    });

    // Enroll user in course
    await this.enrollmentsService.enrollInCourse(order.userId, order.courseId, {
      couponCode: order.couponId ? (await this.prisma.coupon.findUnique({ where: { id: order.couponId } }))?.code : undefined,
      useWallet: order.walletAmountUsed > 0,
    });

    // Update coupon usage if used
    if (order.couponId) {
      await this.prisma.coupon.update({
        where: { id: order.couponId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    // Process referral if this is first purchase
    const existingOrders = await this.prisma.order.count({
      where: {
        userId: order.userId,
        status: OrderStatus.COMPLETED,
      },
    });

    if (existingOrders === 1) {
      await this.referralsService.processReferral(order.userId);
    }

    return {
      order: updatedOrder,
      message: 'Payment verified and enrollment successful',
    };
  }

  async handleWebhook(body: any, signature: string) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get('RAZORPAY_WEBHOOK_SECRET'))
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.payload.payment.entity;

    if (body.event === 'payment.captured') {
      const order = await this.prisma.order.findFirst({
        where: { razorpayOrderId: event.order_id },
      });

      if (order && order.status !== OrderStatus.COMPLETED) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.COMPLETED,
            razorpayPaymentId: event.id,
          },
        });

        // Enroll user
        await this.enrollmentsService.enrollInCourse(order.userId, order.courseId);
      }
    } else if (body.event === 'payment.failed') {
      const order = await this.prisma.order.findFirst({
        where: { razorpayOrderId: event.order_id },
      });

      if (order) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.FAILED,
          },
        });
      }
    }

    return { received: true };
  }

  async getPaymentHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
          coupon: {
            select: {
              code: true,
              discountType: true,
              discountValue: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async generateInvoice(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        course: true,
        user: {
          select: {
            name: true,
            email: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only generate your own invoices');
    }

    // Generate invoice data
    const invoice = {
      invoiceNumber: `INV-${order.id.slice(0, 8).toUpperCase()}`,
      date: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        address: order.user.address || 'N/A',
      },
      items: [
        {
          description: order.course.title,
          quantity: 1,
          unitPrice: order.amount,
          total: order.amount,
        },
      ],
      discount: order.discountAmount,
      walletCredit: order.walletAmountUsed,
      total: order.finalAmount,
      status: order.status,
    };

    return invoice;
  }

  async refundOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only refund your own orders');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Only completed orders can be refunded');
    }

    // Process refund through Razorpay
    if (order.razorpayPaymentId) {
      await this.razorpay.payments.refund(order.razorpayPaymentId, {
        amount: order.finalAmount * 100,
      });
    }

    // Update order status
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.REFUNDED,
      },
    });

    // Unenroll user
    await this.enrollmentsService.unenrollFromCourse(order.courseId, userId);

    // Refund to wallet
    if (order.finalAmount > 0) {
      await this.walletService.addToWallet(userId, order.finalAmount, 'Refund for order', ReferenceType.REFUND, orderId);
    }

    return { message: 'Refund processed successfully' };
  }
}
