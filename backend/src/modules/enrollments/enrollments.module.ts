import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { CouponsModule } from '../coupons/coupons.module';
import { WalletModule } from '../wallet/wallet.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [CouponsModule, WalletModule, PricingModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
