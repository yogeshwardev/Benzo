import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { CouponsService } from './coupons.service';

@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createCoupon(@Request() req, @Body() body: any) {
    return this.couponsService.createCoupon(req.user.id, body);
  }

  @Get()
  async getCoupons(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isActive') isActive?: string,
  ) {
    return this.couponsService.getCoupons(
      parseInt(page),
      parseInt(limit),
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    );
  }

  @Get('validate/:code')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(
    @Param('code') code: string,
    @Query('courseId') courseId: string,
    @Request() req,
  ) {
    return this.couponsService.validateCoupon(code, courseId, req.user.id);
  }

  @Get(':id')
  async getCouponById(@Param('id') id: string) {
    return this.couponsService.getCouponById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateCoupon(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.couponsService.updateCoupon(id, req.user.id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteCoupon(@Param('id') id: string, @Request() req) {
    return this.couponsService.deleteCoupon(id, req.user.id);
  }
}
