import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.id);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.walletService.getTransactions(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Post('add-funds')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async addFundsByAdmin(
    @Request() req,
    @Body() body: { userId: string; amount: number; description: string },
  ) {
    return this.walletService.addFundsByAdmin(
      body.userId,
      body.amount,
      body.description,
      req.user.id,
    );
  }

  @Get('admin/total-balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getTotalBalance() {
    return this.walletService.getTotalBalance();
  }
}
