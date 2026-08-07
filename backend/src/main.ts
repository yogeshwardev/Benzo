import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { RequestSizeMiddleware } from './common/middleware/request-size.middleware';
import { InputSanitizationMiddleware } from './common/middleware/input-sanitization.middleware';
import { IpBlockingMiddleware } from './common/middleware/ip-blocking.middleware';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Custom security middleware
  const requestSizeMiddleware = new RequestSizeMiddleware();
  const inputSanitizationMiddleware = new InputSanitizationMiddleware();
  const ipBlockingMiddleware = new IpBlockingMiddleware();
  const csrfMiddleware = new CsrfMiddleware(configService);

  app.use(requestSizeMiddleware.use.bind(requestSizeMiddleware));
  app.use(inputSanitizationMiddleware.use.bind(inputSanitizationMiddleware));
  app.use(ipBlockingMiddleware.use.bind(ipBlockingMiddleware));
  app.use(csrfMiddleware.use.bind(csrfMiddleware));

  // CORS configuration
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SkillForge Academy API')
    .setDescription('A modern Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('courses', 'Course management')
    .addTag('enrollments', 'Course enrollments')
    .addTag('lessons', 'Lesson management')
    .addTag('assignments', 'Assignment management')
    .addTag('quizzes', 'Quiz management')
    .addTag('live-classes', 'Live class management')
    .addTag('payments', 'Payment processing')
    .addTag('coupons', 'Coupon management')
    .addTag('wallet', 'Wallet management')
    .addTag('referrals', 'Referral system')
    .addTag('certificates', 'Certificate management')
    .addTag('notifications', 'Notification system')
    .addTag('analytics', 'Analytics and reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
