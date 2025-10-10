import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { RefreshToken } from '../entities/refresh-token';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<Repository<User>>;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(RefreshToken), useValue: { findOne: jest.fn(), save: jest.fn() } },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation((payload?: any, opts?: any) => {
              // First call (access) -> return fixed token, Second call (refresh) -> return JWT-like with exp
              // We use opts.expiresIn to differentiate: access uses JWT_EXPIRES_IN, refresh uses JWT_REFRESH_EXPIRES_IN
              if (opts && String(opts.expiresIn).includes('7')) {
                const p = { exp: Math.floor(Date.now() / 1000) + 3600 };
                return Promise.resolve(`e30.${Buffer.from(JSON.stringify(p)).toString('base64')}.sig`);
              }
              return Promise.resolve('token');
            }),
            verifyAsync: jest.fn().mockImplementation(() => ({ sub: 'id', jti: 'jti' })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: any) => {
              if (key === 'JWT_EXPIRES_IN') return '900s';
              if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
              if (key === 'JWT_SECRET') return 'secret';
              return fallback;
            },
          },
        },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
    repo = moduleRef.get(getRepositoryToken(User));
    jwt = moduleRef.get(JwtService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('register rejects duplicate', async () => {
    repo.findOne.mockResolvedValue({ userId: 'u1' } as any);
    await expect(service.register('a@b.com', 'pw')).rejects.toBeInstanceOf(ConflictException);
  });

  it('register saves user and returns tokens', async () => {
    repo.findOne.mockResolvedValue(null as any);
    repo.create.mockReturnValue({ userEmail: 'a@b.com' } as any);
    repo.save.mockResolvedValue({ userId: 'id', userEmail: 'a@b.com' } as any);
    const res = await service.register('a@b.com', 'pw');
    expect(res.accessToken).toBe('token');
  });

  it('login unauthorized when user absent', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.login('a@b.com', 'pw')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login unauthorized on bad password', async () => {
    repo.findOne.mockResolvedValue({ userPassword: 'hash' } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(service.login('a@b.com', 'pw')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
