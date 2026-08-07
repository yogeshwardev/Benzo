import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ReferralStatus } from '@skillforge/shared';
import { WalletService } from '../wallet/wallet.service';
import { ReferenceType } from '@skillforge/shared';

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async getReferralCode(userId: string) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    return referralCode;
  }

  async generateReferralCode(userId: string) {
    const existingCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (existingCode) {
      return existingCode;
    }

    const code = this.generateCode();

    const referralCode = await this.prisma.referralCode.create({
      data: {
        userId,
        code,
      },
    });

    return referralCode;
  }

  async applyReferralCode(refereeId: string, code: string) {
    // Validate referral code before applying
    const validation = await this.validateReferralCode(code, refereeId);
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    // Find referral code
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
      include: {
        user: true,
      },
    });

    // Create pending referral transaction
    const transaction = await this.prisma.referralTransaction.create({
      data: {
        referrerId: referralCode.userId,
        refereeId,
        refereeEarning: 200, // ₹200 for referee
        referrerEarning: 200, // ₹200 for referrer
        status: ReferralStatus.PENDING,
      },
    });

    // Update referral code stats
    await this.prisma.referralCode.update({
      where: { id: referralCode.id },
      data: {
        totalReferrals: {
          increment: 1,
        },
      },
    });

    return {
      transaction,
      refereeEarning: 200,
      referrerEarning: 200,
      message: 'Referral code applied. Complete your first purchase to earn rewards.',
    };
  }

  async validateReferralCode(code: string, refereeId?: string) {
    // Check if code exists
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
      include: {
        user: true,
      },
    });

    if (!referralCode) {
      return { valid: false, message: 'Invalid referral code' };
    }

    // Check if referrer account is active
    if (!referralCode.user.isActive) {
      return { valid: false, message: 'Referral code owner account is not active' };
    }

    // Check if referrer has completed KYC if required
    if (referralCode.user.role === 'INSTRUCTOR' && !referralCode.user.isEmailVerified) {
      return { valid: false, message: 'Referral code owner has not verified their email' };
    }

    // Check if referee is trying to use their own code
    if (refereeId && referralCode.userId === refereeId) {
      return { valid: false, message: 'You cannot use your own referral code' };
    }

    // Check if referee has already used a referral
    if (refereeId) {
      const existingTransaction = await this.prisma.referralTransaction.findFirst({
        where: { refereeId },
      });

      if (existingTransaction) {
        return { valid: false, message: 'You have already used a referral code' };
      }
    }

    // Check if referrer has reached referral limit (optional: max 100 referrals)
    if (referralCode.totalReferrals >= 100) {
      return { valid: false, message: 'This referral code has reached its usage limit' };
    }

    return {
      valid: true,
      referralCode: {
        code: referralCode.code,
        referrerName: referralCode.user.name,
        totalReferrals: referralCode.totalReferrals,
        successfulReferrals: referralCode.successfulReferrals,
      },
    };
  }

  async processReferral(userId: string) {
    // Find pending referral transaction
    const transaction = await this.prisma.referralTransaction.findFirst({
      where: {
        refereeId: userId,
        status: ReferralStatus.PENDING,
      },
    });

    if (!transaction) {
      return { message: 'No pending referral found' };
    }

    // Credit referee wallet
    await this.walletService.addToWallet(
      userId,
      transaction.refereeEarning,
      'Referral bonus',
      ReferenceType.REFERRAL,
      transaction.id,
    );

    // Credit referrer wallet
    await this.walletService.addToWallet(
      transaction.referrerId,
      transaction.referrerEarning,
      'Referral bonus',
      ReferenceType.REFERRAL,
      transaction.id,
    );

    // Update transaction status
    await this.prisma.referralTransaction.update({
      where: { id: transaction.id },
      data: {
        status: ReferralStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Update referral code stats
    await this.prisma.referralCode.update({
      where: { userId: transaction.referrerId },
      data: {
        successfulReferrals: {
          increment: 1,
        },
        totalEarnings: {
          increment: transaction.referrerEarning,
        },
      },
    });

    return { message: 'Referral processed successfully' };
  }

  async getReferralStats(userId: string) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    const transactions = await this.prisma.referralTransaction.findMany({
      where: {
        referrerId: userId,
        status: ReferralStatus.COMPLETED,
      },
      include: {
        referee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    return { ...referralCode, transactions };
  }

  async getReferralHistory(userId: string, page: number = 1, limit: number = 10) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.referralTransaction.findMany({
        where: { referrerId: userId },
        skip,
        take: limit,
        include: {
          referee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.referralTransaction.count({
        where: { referrerId: userId },
      }),
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
