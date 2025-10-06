import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPair } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
      userRole: 'user',
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
    const payload = { sub: user.userId, email: user.userEmail, role: user.userRole };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '900s'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }
}
