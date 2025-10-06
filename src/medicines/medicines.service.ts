import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from '../entities/medicine';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { CreateProspectusDto } from './dto/create-prospectus.dto';
import { toMedicineResponse } from './mappers/medicine.mapper';
import { toProspectusResponse } from './mappers/prospectus.mapper';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine) private readonly meds: Repository<Medicine>,
    @InjectRepository(MedicineProspectus) private readonly pros: Repository<MedicineProspectus>,
  ) {}

  async create(userId: string, dto: CreateMedicineDto) {
    const entity = this.meds.create({
      medicineCreatedBy: userId,
      medicineCompanyId: dto.companyId,
      medicineName: dto.name,
      medicineRegistrationDate: new Date(),
    });
    const saved = await this.meds.save(entity);
    return toMedicineResponse(saved);
  }

  async list() {
    const list = await this.meds.find();
    return list.map(toMedicineResponse);
  }

  async get(id: string) {
    const med = await this.meds.findOne({ where: { medicineId: id } });
    if (!med) throw new NotFoundException('Medicine not found');
    return toMedicineResponse(med);
  }

  async addProspectus(userId: string, dto: CreateProspectusDto) {
    const med = await this.meds.findOne({ where: { medicineId: dto.medicineId } });
    if (!med) throw new NotFoundException('Medicine not found');
    const entity = this.pros.create({
      medicineId: dto.medicineId,
      prospectusDescription: dto.description,
      prospectusCreatedBy: userId,
      prospectusRegistrationDate: new Date(),
    });
    const saved = await this.pros.save(entity);
    return toProspectusResponse(saved);
  }

  async listProspectus(medicineId: string) {
    const list = await this.pros.find({ where: { medicineId } });
    return list.map(toProspectusResponse);
  }
}
