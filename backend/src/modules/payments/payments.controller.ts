import { Controller, Post, Get, Body, Param, UseGuards, Request, Query, Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(@Request() req, @Body() body: { courseId: string; couponCode?: string; useWallet?: boolean; paymentMethod?: string }) {
    return this.paymentsService.createOrder(req.user.id, body.courseId, body);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: { orderId: string; paymentId: string; signature: string }) {
    return this.paymentsService.verifyPayment(body.orderId, body.paymentId, body.signature);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.handleWebhook(body, signature);
  }

  @Get('history')
  async getPaymentHistory(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.paymentsService.getPaymentHistory(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id/invoice')
  async generateInvoice(@Param('id') id: string, @Request() req) {
    return this.paymentsService.generateInvoice(id, req.user.id);
  }

  @Post(':id/refund')
  async refundOrder(@Param('id') id: string, @Request() req) {
    return this.paymentsService.refundOrder(id, req.user.id);
  }
}
