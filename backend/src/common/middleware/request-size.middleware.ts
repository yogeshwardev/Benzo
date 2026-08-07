import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestSizeMiddleware implements NestMiddleware {
  private readonly MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

  use(req: Request, res: Response, next: NextFunction) {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > this.MAX_REQUEST_SIZE) {
      throw new BadRequestException('Request body too large');
    }

    next();
  }
}
