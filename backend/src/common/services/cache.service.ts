import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private cache: Map<string, { data: any; expiresAt: number }>;
  private readonly DEFAULT_TTL = 300000; // 5 minutes

  constructor(private configService: ConfigService) {
    this.cache = new Map();
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expiry = ttl || this.DEFAULT_TTL;
    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + expiry,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const cached = this.cache.get(key);
    if (!cached) return false;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now > data.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Cache key generators for common patterns
  static keys = {
    user: (id: string) => `user:${id}`,
    course: (id: string) => `course:${id}`,
    enrollment: (userId: string, courseId: string) => `enrollment:${userId}:${courseId}`,
    courses: (filters: string) => `courses:${filters}`,
    instructorCourses: (instructorId: string) => `instructor:${instructorId}:courses`,
    coupon: (code: string) => `coupon:${code}`,
    referralCode: (code: string) => `referral:${code}`,
    wallet: (userId: string) => `wallet:${userId}`,
    certificate: (userId: string, courseId: string) => `certificate:${userId}:${courseId}`,
    analytics: (type: string, period: string) => `analytics:${type}:${period}`,
  };
}
