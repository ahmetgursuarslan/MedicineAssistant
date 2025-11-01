import { Body, Controller, Get, Post, UseGuards, Req, Res, Query } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.auth.register(dto.email, dto.password);
    // Send email verification after registration
    await this.auth.sendEmailVerification(dto.email);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.forgotPassword(dto.email);
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async sendVerificationEmail(@Body() body: { email: string }) {
    await this.auth.sendEmailVerification(body.email);
    return { message: 'Verification email sent if user exists.' };
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  async googleAuth(@Req() req: any) {
    // This will be handled by passport
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    // After successful Google authentication, we redirect to frontend with tokens
    // In a real app, you'd handle this differently, but for now, we'll return JSON
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Check if user already exists, if not create a new one
    const { email, name } = req.user;
    let user = await this.auth.findOrCreateGoogleUser(email, name);
    
    // Generate JWT for the user
    const tokens = await this.auth.issueTokensForGoogleUser(user);
    
    // Redirect to frontend with tokens (or return JSON depending on implementation)
    // For now, return tokens directly - in a real app you'd redirect to frontend
    return res.json(tokens);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  me(@CurrentUser() user: any) {
    return user;
  }
}
