import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Request() req) {
    const ip = req.headers['x-forwarded-for'] as string || req.headers['x-real-ip'] as string || req.socket.remoteAddress;
    return this.authService.login(body.email, body.password, ip);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Request() req) {
    return this.authService.googleLogin(
      req.user.googleId,
      req.user.email,
      req.user.name,
      req.user.avatar,
    );
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() body: { userId: string }) {
    return this.authService.verifyEmail(body.userId);
  }

  @Get('me')
  async getCurrentUser(@Request() req) {
    return req.user;
  }
}
