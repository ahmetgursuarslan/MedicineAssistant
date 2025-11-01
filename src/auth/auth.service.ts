import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPair } from './interfaces/tokens.interface';
import { RefreshToken } from '../entities/refresh-token';
import { randomUUID } from 'crypto';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(email: string, password: string): Promise<TokenPair> {
    const exists = await this.userRepo.findOne({ where: { userEmail: email } });
    if (exists) throw new ConflictException('Email already registered');
    const hash = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      userEmail: email,
      userPassword: hash,
      userRegistrationDate: new Date(),
      userActive: true,
      userRole: 'user', // Default role for new users is 'user'
    });
    await this.userRepo.save(user);
    return this.issueTokens(user);
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.userRepo.findOne({ where: { userEmail: email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.userPassword);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user);
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const jti = randomUUID();
    const payload = { sub: user.userId, email: user.userEmail, role: user.userRole, jti };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '900s'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    // Persist hashed refresh token for rotation/verification
    const tokenHash = await bcrypt.hash(refreshToken, 12);
    const exp = this.decodeExp(refreshToken);
    await this.rtRepo.save({
      tokenId: jti,
      userId: user.userId,
      tokenHash,
      expiresAt: new Date(exp * 1000),
      revoked: false,
    } as any);
    return { accessToken, refreshToken };
  }

  private decodeExp(token: string): number {
    const [, payloadB64] = token.split('.');
    const json = Buffer.from(payloadB64, 'base64').toString('utf8');
    const { exp } = JSON.parse(json);
    return exp;
  }

  async refresh(oldRefreshToken: string): Promise<TokenPair> {
    // Verify signature first
    let decoded: any;
    try {
      decoded = await this.jwt.verifyAsync(oldRefreshToken, { secret: this.config.get<string>('JWT_SECRET') });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { sub: userId, jti } = decoded;
    const record = await this.rtRepo.findOne({ where: { tokenId: jti, userId } });
    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }
    const match = await bcrypt.compare(oldRefreshToken, record.tokenHash);
    if (!match) throw new UnauthorizedException('Invalid refresh token');
    // Rotate: revoke old, issue new
    record.revoked = true;
    await this.rtRepo.save(record);
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueTokens(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { userEmail: email } });
    if (!user) {
      // Don't leak if email exists - return success anyway
      return;
    }

    // Generate password reset token
    const resetToken = randomUUID();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await this.userRepo.save(user);

    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<TokenPair> {
    const now = new Date();
    const user = await this.userRepo.findOne({
      where: { 
        passwordResetToken: token 
      }
    });
    
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < now) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 12);
    user.userPassword = hash;
    
    // Clear reset token
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    
    await this.userRepo.save(user);

    // Issue new tokens
    return this.issueTokens(user);
  }

  async sendEmailVerification(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { userEmail: email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate email verification token
    const verificationToken = randomUUID();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hour expiry

    // Update user with verification token
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationTokenExpiry;
    await this.userRepo.save(user);

    // Send verification email
    await this.emailService.sendEmailVerification(email, verificationToken);
  }

  async verifyEmail(token: string): Promise<TokenPair> {
    const now = new Date();
    const potentialUser = await this.userRepo.findOne({
      where: { 
        emailVerificationToken: token 
      }
    });
    
    if (!potentialUser || !potentialUser.emailVerificationExpires || potentialUser.emailVerificationExpires < now) {
      throw new UnauthorizedException('Invalid or expired email verification token');
    }

    // Verify email
    potentialUser.emailVerified = true;
    potentialUser.emailVerificationToken = null;
    potentialUser.emailVerificationExpires = null;
    
    await this.userRepo.save(potentialUser);

    // Issue new tokens for the verified user
    return this.issueTokens(potentialUser);
  }

  async findOrCreateGoogleUser(email: string, name: string): Promise<User> {
    let user = await this.userRepo.findOne({ where: { userEmail: email } });
    
    if (!user) {
      // Create a new user if they don't exist
      user = this.userRepo.create({
        userEmail: email,
        userPassword: '', // No password for Google auth
        userRegistrationDate: new Date(),
        userActive: true,
        userRole: 'user',
        emailVerified: true, // Google-verified email is trusted
      });
      user = await this.userRepo.save(user);
    }
    
    return user;
  }

  async issueTokensForGoogleUser(user: User): Promise<TokenPair> {
    const jti = randomUUID();
    const payload = { sub: user.userId, email: user.userEmail, role: user.userRole, jti };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    
    // Store refresh token for rotation
    const tokenHash = await bcrypt.hash(refreshToken, 12);
    const exp = this.decodeExp(refreshToken);
    await this.rtRepo.save({
      tokenId: jti,
      userId: user.userId,
      tokenHash,
      expiresAt: new Date(exp * 1000),
      revoked: false,
    } as any);
    
    return { accessToken, refreshToken };
  }
}
