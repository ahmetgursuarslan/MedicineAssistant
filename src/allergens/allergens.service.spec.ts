import { Test } from '@nestjs/testing';
import { AllergensService } from './allergens.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Allergen } from '../entities/allergen';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AllergensService', () => {
  let service: AllergensService;
  let repo: jest.Mocked<Repository<Allergen>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AllergensService,
        { provide: getRepositoryToken(Allergen), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(AllergensService);
    repo = moduleRef.get(getRepositoryToken(Allergen));
  });

  it('create returns mapped allergen', async () => {
    repo.create.mockReturnValue({ alerjenId: 'a1' } as any);
    repo.save.mockResolvedValue({ alerjenId: 'a1', alerjenName: 'Peanut' } as any);
    const res = await service.create('u1', { name: 'Peanut', description: 'd' } as any);
    expect(res.id).toBe('a1');
  });

  it('findAll returns list', async () => {
    repo.find.mockResolvedValue([{ alerjenId: 'a1', userId: 'u1' }] as any);
    const list = await service.findAll('u1');
    expect(list.length).toBe(1);
  });

  it('findOne throws when missing', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.findOne('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
