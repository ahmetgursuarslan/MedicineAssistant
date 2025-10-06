import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from '../entities/medicine';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, MedicineProspectus])],
  providers: [MedicinesService],
  controllers: [MedicinesController],
  exports: [MedicinesService],
})
export class MedicinesModule {}
