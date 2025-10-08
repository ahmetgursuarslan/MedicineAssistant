import { Test } from '@nestjs/testing';
import { RemindersService } from './reminders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reminder } from '../entities/reminder';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RemindersService', () => {
  let service: RemindersService;
  let repo: jest.Mocked<Repository<Reminder>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RemindersService,
        { provide: getRepositoryToken(Reminder), useValue: { find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(RemindersService);
    repo = moduleRef.get(getRepositoryToken(Reminder));
  });

  it('list returns mapped reminders', async () => {
    repo.find.mockResolvedValue([{ reminderId: 1, timerId: 't1' }] as any);
    const list = await service.list('t1');
    expect(list[0].id).toBe(1);
  });

  it('get throws when missing', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.get(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
