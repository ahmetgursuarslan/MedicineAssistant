import { Test } from '@nestjs/testing';
import { TimersService } from './timers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Timer } from '../entities/timer';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TimersService', () => {
  let service: TimersService;
  let repo: jest.Mocked<Repository<Timer>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TimersService,
        { provide: getRepositoryToken(Timer), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(TimersService);
    repo = moduleRef.get(getRepositoryToken(Timer));
  });

  it('create timer', async () => {
    repo.create.mockReturnValue({ timerId: 't1' } as any);
    repo.save.mockResolvedValue({ timerId: 't1' } as any);
    const res = await service.create('u1', { medicineId: 'm1', medicineCount: 1, dailyType: 'ONCE', startDate: new Date().toISOString(), finishDate: new Date().toISOString(), weeklyType: null } as any);
    expect(res.id).toBe('t1');
  });

  it('get throws when not found', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.get('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
