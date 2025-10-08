import { Test } from '@nestjs/testing';
import { DiseasesService } from './diseases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Disease } from '../entities/disease';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DiseasesService', () => {
  let service: DiseasesService;
  let repo: jest.Mocked<Repository<Disease>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DiseasesService,
        { provide: getRepositoryToken(Disease), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(DiseasesService);
    repo = moduleRef.get(getRepositoryToken(Disease));
  });

  it('create returns mapped disease', async () => {
    repo.create.mockReturnValue({ diseasesId: 'd1' } as any);
    repo.save.mockResolvedValue({ diseasesId: 'd1', diseasesName: 'X' } as any);
    const res = await service.create('u1', { name: 'X', description: 'desc' } as any);
    expect(res.id).toBe('d1');
  });

  it('findAll filters by user', async () => {
    repo.find.mockResolvedValue([{ diseasesId: 'd1', userId: 'u1' }] as any);
    const list = await service.findAll('u1');
    expect(list[0].id).toBe('d1');
  });

  it('findOne throws when not found', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.findOne('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
