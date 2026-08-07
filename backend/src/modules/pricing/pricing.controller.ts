import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('pricing')
@UseGuards(JwtAuthGuard)
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Post('calculate')
  async calculateFinalPrice(@Body() body: {
    courseId: string;
    couponCode?: string;
    useWallet?: boolean;
    userId?: string;
  }) {
    return this.pricingService.calculateFinalPrice(
      body.courseId,
      {
        couponCode: body.couponCode,
        useWallet: body.useWallet,
        userId: body.userId,
      }
    );
  }

  @Get('breakdown/:courseId')
  async getPricingBreakdown(@Param('courseId') courseId: string) {
    return this.pricingService.getPricingBreakdown(courseId);
  }

  @Post('instructor-earnings')
  async calculateInstructorEarnings(@Body() body: {
    courseId: string;
    saleAmount: number;
  }) {
    return this.pricingService.calculateInstructorEarnings(
      body.courseId,
      body.saleAmount
    );
  }

  @Post('refund/:orderId')
  async calculateRefundAmount(@Param('orderId') orderId: string) {
    return this.pricingService.calculateRefundAmount(orderId);
  }
}
