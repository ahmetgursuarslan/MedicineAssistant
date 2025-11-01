import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email address by clicking this link: ${verifyUrl}`,
      html: `
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="background-color: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${verifyUrl}</p>
        <p>If you didn't register for this account, please ignore this email.</p>
      `,
    });
  }
}