import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('my-code')
  async getReferralCode(@Request() req) {
    return this.referralsService.getReferralCode(req.user.id);
  }

  @Post('validate')
  async validateReferralCode(@Request() req, @Body() body: { code: string }) {
    return this.referralsService.validateReferralCode(body.code, req.user.id);
  }

  @Post('apply')
  async applyReferralCode(@Request() req, @Body() body: { code: string }) {
    return this.referralsService.applyReferralCode(req.user.id, body.code);
  }

  @Get('stats')
  async getReferralStats(@Request() req) {
    return this.referralsService.getReferralStats(req.user.id);
  }

  @Get('history')
  async getReferralHistory(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.referralsService.getReferralHistory(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }
}
