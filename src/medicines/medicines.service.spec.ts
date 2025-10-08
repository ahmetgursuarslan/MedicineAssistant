import { Test } from '@nestjs/testing';
import { MedicinesService } from './medicines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medicine } from '../entities/medicine';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MedicinesService', () => {
  let service: MedicinesService;
  let meds: jest.Mocked<Repository<Medicine>>;
  let pros: jest.Mocked<Repository<MedicineProspectus>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MedicinesService,
        { provide: getRepositoryToken(Medicine), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
        { provide: getRepositoryToken(MedicineProspectus), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(MedicinesService);
    meds = moduleRef.get(getRepositoryToken(Medicine));
    pros = moduleRef.get(getRepositoryToken(MedicineProspectus));
  });

  it('create medicine', async () => {
    meds.create.mockReturnValue({ medicineId: 'm1' } as any);
    meds.save.mockResolvedValue({ medicineId: 'm1', medicineName: 'X' } as any);
    const res = await service.create('u1', { name: 'X', companyId: 'c1' } as any);
    expect(res.id).toBe('m1');
  });

  it('get throws when missing', async () => {
    meds.findOne.mockResolvedValue(null as any);
    await expect(service.get('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('addProspectus requires existing medicine', async () => {
    meds.findOne.mockResolvedValue(null as any);
    await expect(service.addProspectus('u1', { medicineId: 'x', description: 'd' } as any)).rejects.toBeInstanceOf(NotFoundException);
  });
});
