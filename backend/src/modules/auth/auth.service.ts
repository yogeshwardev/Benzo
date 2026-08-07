import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { UserRole } from '@skillforge/shared';
import { IpBlockingMiddleware } from '../../common/middleware/ip-blocking.middleware';

@Injectable()
export class AuthService {
  private resend: Resend;
  private ipBlockingMiddleware: IpBlockingMiddleware;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY') || 're_dummy_key_12345');
    this.ipBlockingMiddleware = new IpBlockingMiddleware();
  }

  async register(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.STUDENT,
      },
    });

    // Create wallet
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });

    // Generate referral code
    const referralCode = await this.generateReferralCode(user.id);

    // Send verification email
    await this.sendVerificationEmail(user.email, user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(email: string, password: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      if (ip) {
        await this.ipBlockingMiddleware.recordFailedAttempt(ip);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      if (ip) {
        await this.ipBlockingMiddleware.recordFailedAttempt(ip);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async googleLogin(googleId: string, email: string, name: string, avatar?: string) {
    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Link Google account
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId, avatar: avatar || existingUser.avatar },
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email,
            name,
            googleId,
            avatar,
            role: UserRole.STUDENT,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
          },
        });

        // Create wallet
        await this.prisma.wallet.create({
          data: {
            userId: user.id,
          },
        });

        // Generate referral code
        await this.generateReferralCode(user.id);
      }
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If user exists, password reset email sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // Store reset token in a separate field or use a different approach
        // For simplicity, we'll use the education field temporarily
        education: resetToken,
        emailVerifiedAt: resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    await this.resend.emails.send({
      from: this.configService.get('RESEND_FROM_EMAIL'),
      to: email,
      subject: 'Password Reset - SkillForge Academy',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return { message: 'If user exists, password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        education: token,
        emailVerifiedAt: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        education: null,
        emailVerifiedAt: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async verifyEmail(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    return { message: 'Email verified successfully' };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateReferralCode(userId: string) {
    const code = this.generateCode();
    await this.prisma.referralCode.create({
      data: {
        userId,
        code,
      },
    });
    return code;
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async sendVerificationEmail(email: string, userId: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?userId=${userId}`;

    await this.resend.emails.send({
      from: this.configService.get('RESEND_FROM_EMAIL'),
      to: email,
      subject: 'Verify Your Email - SkillForge Academy',
      html: `
        <h1>Welcome to SkillForge Academy!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });
  }

  private sanitizeUser(user: any) {
    const { password, googleId, ...sanitized } = user;
    return sanitized;
  }
}
