import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { Allergen } from '../entities/allergen';
import { Disease } from '../entities/disease';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicineProspectus, Allergen, Disease])],
  providers: [RiskService],
  controllers: [RiskController],
})
export class RiskModule {}
