import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { CouponsModule } from '../coupons/coupons.module';
import { WalletModule } from '../wallet/wallet.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [EnrollmentsModule, CouponsModule, WalletModule, ReferralsModule, PricingModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
