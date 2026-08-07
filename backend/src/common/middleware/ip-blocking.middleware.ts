import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpBlockingMiddleware implements NestMiddleware {
  private readonly blockedIps = new Map<string, { expiresAt: number; attemptCount: number }>();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 60 * 60 * 1000; // 1 hour

  use(req: Request, res: Response, next: NextFunction) {
    const ip = this.getClientIp(req);

    // Check if IP is blocked
    const blockedIp = this.blockedIps.get(ip);

    if (blockedIp) {
      // Check if block has expired
      if (Date.now() < blockedIp.expiresAt) {
        throw new ForbiddenException('Your IP has been temporarily blocked due to suspicious activity');
      } else {
        // Remove expired block
        this.blockedIps.delete(ip);
      }
    }

    next();
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  blockIp(ip: string, reason: string = 'Suspicious activity') {
    const expiresAt = Date.now() + this.BLOCK_DURATION;

    this.blockedIps.set(ip, {
      expiresAt,
      attemptCount: this.blockedIps.get(ip)?.attemptCount || 1,
    });
  }

  recordFailedAttempt(ip: string) {
    const blockedIp = this.blockedIps.get(ip);

    if (blockedIp) {
      const newAttemptCount = blockedIp.attemptCount + 1;

      if (newAttemptCount >= this.MAX_FAILED_ATTEMPTS) {
        this.blockIp(ip, 'Too many failed attempts');
      } else {
        this.blockedIps.set(ip, {
          expiresAt: blockedIp.expiresAt,
          attemptCount: newAttemptCount,
        });
      }
    } else {
      this.blockedIps.set(ip, {
        expiresAt: Date.now() + this.BLOCK_DURATION,
        attemptCount: 1,
      });
    }
  }

  // Clean up expired entries periodically
  cleanupExpiredBlocks(): void {
    const now = Date.now();
    for (const [ip, data] of this.blockedIps.entries()) {
      if (now > data.expiresAt) {
        this.blockedIps.delete(ip);
      }
    }
  }
}
