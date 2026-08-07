import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma.module';
import { CacheModule } from './common/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { LiveClassesModule } from './modules/live-classes/live-classes.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    EnrollmentsModule,
    AssignmentsModule,
    QuizzesModule,
    LiveClassesModule,
    PaymentsModule,
    CouponsModule,
    WalletModule,
    ReferralsModule,
    CertificatesModule,
    NotificationsModule,
    AnalyticsModule,
    PricingModule,
    HealthModule,
  ],
})
export class AppModule {}
