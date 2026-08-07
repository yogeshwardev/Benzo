import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly csrfTokens = new Map<string, { token: string; expiresAt: number }>();
  private readonly TOKEN_EXPIRY = 3600000; // 1 hour

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      // Generate and send CSRF token for safe methods
      const csrfToken = this.generateToken();
      res.setHeader('X-CSRF-Token', csrfToken);
      return next();
    }

    // Check CSRF token for state-changing methods
    const csrfToken = req.headers['x-csrf-token'] as string;
    const sessionToken = this.getSessionToken(req);

    if (!csrfToken || !sessionToken) {
      throw new ForbiddenException('CSRF token missing');
    }

    const storedToken = this.csrfTokens.get(sessionToken);

    if (!storedToken || storedToken.token !== csrfToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    if (Date.now() > storedToken.expiresAt) {
      this.csrfTokens.delete(sessionToken);
      throw new ForbiddenException('CSRF token expired');
    }

    // Regenerate token after successful validation
    const newToken = this.generateToken();
    this.csrfTokens.set(sessionToken, {
      token: newToken,
      expiresAt: Date.now() + this.TOKEN_EXPIRY,
    });
    res.setHeader('X-CSRF-Token', newToken);

    next();
  }

  private generateToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  private getSessionToken(req: Request): string {
    // Extract session token from authorization header or cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Alternatively, use session cookie
    const sessionCookie = req.headers.cookie;
    if (sessionCookie) {
      const match = sessionCookie.match(/session=([^;]+)/);
      if (match) {
        return match[1];
      }
    }

    return '';
  }

  validateToken(token: string, sessionToken: string): boolean {
    const storedToken = this.csrfTokens.get(sessionToken);
    return storedToken && storedToken.token === token && Date.now() <= storedToken.expiresAt;
  }

  revokeToken(sessionToken: string): void {
    this.csrfTokens.delete(sessionToken);
  }

  // Clean up expired tokens periodically
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionToken, data] of this.csrfTokens.entries()) {
      if (now > data.expiresAt) {
        this.csrfTokens.delete(sessionToken);
      }
    }
  }
}
