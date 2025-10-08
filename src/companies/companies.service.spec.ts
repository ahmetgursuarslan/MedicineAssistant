import { Test } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../entities/company';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repo: jest.Mocked<Repository<Company>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: getRepositoryToken(Company), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(CompaniesService);
    repo = moduleRef.get(getRepositoryToken(Company));
  });

  it('create saves and maps', async () => {
    repo.create.mockReturnValue({ companyId: 'c1' } as any);
    repo.save.mockResolvedValue({ companyId: 'c1', companyName: 'Acme' } as any);
    const res = await service.create('u1', { name: 'Acme', country: 'TR' } as any);
    expect(res.id).toBe('c1');
  });

  it('findAll maps list', async () => {
    repo.find.mockResolvedValue([{ companyId: 'c1' }] as any);
    const list = await service.findAll();
    expect(list).toHaveLength(1);
  });

  it('findOne throws when missing', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
