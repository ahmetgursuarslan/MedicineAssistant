import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { Allergen } from '../entities/allergen';
import { Disease } from '../entities/disease';
import { RiskResponseDto } from './dto/risk-response.dto';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(MedicineProspectus) private readonly prosRepo: Repository<MedicineProspectus>,
    @InjectRepository(Allergen) private readonly allergenRepo: Repository<Allergen>,
    @InjectRepository(Disease) private readonly diseaseRepo: Repository<Disease>,
  ) {}

  async analyze(userId: string, medicineId: string): Promise<RiskResponseDto> {
    const prospectus = await this.prosRepo.find({ where: { medicineId } });
    if (prospectus.length === 0) throw new NotFoundException('Prospectus not found for medicine');
    const text = prospectus.map(p => p.prospectusDescription.toLowerCase()).join('\n');

    const allergens = await this.allergenRepo.find({ where: { userId } });
    const diseases = await this.diseaseRepo.find({ where: { userId } });

    const matchedAllergens: string[] = [];
    for (const a of allergens) {
      if (text.includes(a.alerjenName.toLowerCase())) matchedAllergens.push(a.alerjenName);
    }

    const matchedDiseases: string[] = [];
    for (const d of diseases) {
      if (text.includes(d.diseasesName.toLowerCase())) matchedDiseases.push(d.diseasesName);
    }

    const totalAllergens = allergens.length;
    const totalDiseases = diseases.length;
    const denominator = (totalAllergens || 1) + (totalDiseases || 1);
    const numerator = matchedAllergens.length + matchedDiseases.length;
    const riskScore = Math.min(100, Math.round((numerator / denominator) * 100));

    return {
      medicineId,
      riskScore,
      matchedAllergens,
      matchedDiseases,
      totalAllergens,
      totalDiseases,
    };
  }
}
