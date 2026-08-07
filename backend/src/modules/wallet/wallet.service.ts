import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TransactionType, ReferenceType } from '@skillforge/shared';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async addToWallet(
    userId: string,
    amount: number,
    description: string,
    referenceType?: ReferenceType,
    referenceId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Update wallet balance
    const updatedWallet = await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        amount,
        description,
        referenceType,
        referenceId,
      },
    });

    return {
      wallet: updatedWallet,
      transaction,
    };
  }

  async deductFromWallet(
    userId: string,
    amount: number,
    description: string,
    referenceType?: ReferenceType,
    referenceId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Update wallet balance
    const updatedWallet = await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Create transaction
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        amount,
        description,
        referenceType,
        referenceId,
      },
    });

    return {
      wallet: updatedWallet,
      transaction,
    };
  }

  async getTransactions(userId: string, page: number = 1, limit: number = 10) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({
        where: { walletId: wallet.id },
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

  async addFundsByAdmin(userId: string, amount: number, description: string, adminId: string) {
    // Check if admin is admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (admin.role !== 'ADMIN') {
      throw new BadRequestException('Only admins can add funds');
    }

    return this.addToWallet(userId, amount, description, ReferenceType.ADMIN, adminId);
  }

  async getTotalBalance() {
    const wallets = await this.prisma.wallet.findMany();
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    return { totalBalance, walletCount: wallets.length };
  }
}
