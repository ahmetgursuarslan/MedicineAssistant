import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();
    service = moduleRef.get(UsersService);
    repo = moduleRef.get(getRepositoryToken(User));
  });

  it('findMe returns mapped user', async () => {
    repo.findOne.mockResolvedValue({ userId: 'u1', userEmail: 'a@b.com' } as any);
    const result = await service.findMe('u1');
    expect(result.id).toBe('u1');
  });

  it('findMe throws when missing', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.findMe('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateUser enforces self or admin', async () => {
    repo.findOne.mockResolvedValue({ userId: 'target', userEmail: 't@e.com' } as any);
    await expect(
      service.updateUser({ userId: 'other', userRole: 'user' }, 'target', {} as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updateUser allows self update', async () => {
    repo.findOne.mockResolvedValue({ userId: 'self', userEmail: 'a@b.com' } as any);
    repo.save.mockImplementation(async (u) => u as any);
    const result = await service.updateUser({ userId: 'self', userRole: 'user' }, 'self', { email: 'n@e.com' } as any);
    expect(result.email).toBe('n@e.com');
  });
});
