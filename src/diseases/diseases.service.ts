import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disease } from '../entities/disease';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { toDiseaseResponse } from './mappers/disease.mapper';

@Injectable()
export class DiseasesService {
  constructor(@InjectRepository(Disease) private readonly repo: Repository<Disease>) {}

  async create(userId: string, dto: CreateDiseaseDto) {
    const entity = this.repo.create({
      userId,
      diseasesName: dto.name,
      diseasesDescription: dto.description,
      diseasesRecordDate: new Date(),
    });
    const saved = await this.repo.save(entity);
    return toDiseaseResponse(saved);
  }

  async findAll(userId: string) {
    const list = await this.repo.find({ where: { userId } });
    return list.map(toDiseaseResponse);
  }

  async findOne(userId: string, id: string) {
    const disease = await this.repo.findOne({ where: { diseasesId: id, userId } });
    if (!disease) throw new NotFoundException('Disease not found');
    return toDiseaseResponse(disease);
  }
}
