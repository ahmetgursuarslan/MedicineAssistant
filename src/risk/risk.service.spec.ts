import { Test } from '@nestjs/testing';
import { RiskService } from './risk.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { Allergen } from '../entities/allergen';
import { Disease } from '../entities/disease';
import { NotFoundException } from '@nestjs/common';

describe('RiskService', () => {
  let service: RiskService;
  let prosRepo: any;
  let allergenRepo: any;
  let diseaseRepo: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RiskService,
        { provide: getRepositoryToken(MedicineProspectus), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Allergen), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Disease), useValue: { find: jest.fn() } },
      ],
    }).compile();
    service = moduleRef.get(RiskService);
    prosRepo = moduleRef.get(getRepositoryToken(MedicineProspectus));
    allergenRepo = moduleRef.get(getRepositoryToken(Allergen));
    diseaseRepo = moduleRef.get(getRepositoryToken(Disease));
  });

  it('throws when no prospectus', async () => {
    prosRepo.find.mockResolvedValue([]);
    await expect(service.analyze('u1', 'm1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('computes risk with matches', async () => {
    prosRepo.find.mockResolvedValue([{ prospectusDescription: 'Contains peanut warning' }]);
    allergenRepo.find.mockResolvedValue([{ alerjenName: 'Peanut' }]);
    diseaseRepo.find.mockResolvedValue([{ diseasesName: 'Diabetes' }]);
    const res = await service.analyze('u1', 'm1');
    expect(res.matchedAllergens).toContain('Peanut');
    expect(res.riskScore).toBeGreaterThan(0);
  });
});
