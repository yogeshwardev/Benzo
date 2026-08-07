import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class InputSanitizationMiddleware implements NestMiddleware {
  private readonly MALICIOUS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize request body
    if (req.body) {
      req.body = this.sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = this.sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = this.sanitizeObject(req.params);
    }

    next();
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    let sanitized = str;

    // Check for malicious patterns
    for (const pattern of this.MALICIOUS_PATTERNS) {
      if (pattern.test(sanitized)) {
        throw new ForbiddenException('Malicious input detected');
      }
    }

    // Remove potentially dangerous characters
    sanitized = sanitized
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    return sanitized;
  }
}
