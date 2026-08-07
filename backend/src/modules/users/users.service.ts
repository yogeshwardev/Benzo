import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        education: true,
        isEmailVerified: true,
        createdAt: true,
        wallet: {
          select: {
            balance: true,
          },
        },
        referralCode: {
          select: {
            code: true,
            totalReferrals: true,
            successfulReferrals: true,
            totalEarnings: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    const { password, ...updateData } = data;

    if (password) {
      updateData.password = await argon2.hash(password);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        education: true,
      },
    });

    return user;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }

  async getAllUsers(page: number = 1, limit: number = 10, role?: string) {
    const skip = (page - 1) * limit;

    const where = role ? { role: role as any } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isEmailVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        education: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
