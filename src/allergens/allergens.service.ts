import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergen } from '../entities/allergen';
import { CreateAllergenDto } from './dto/create-allergen.dto';
import { toAllergenResponse } from './mappers/allergen.mapper';

@Injectable()
export class AllergensService {
  constructor(@InjectRepository(Allergen) private readonly repo: Repository<Allergen>) {}

  async create(userId: string, dto: CreateAllergenDto) {
    const entity = this.repo.create({
      userId,
      alerjenName: dto.name,
      alerjenDescription: dto.description,
      alerjenRecordDate: new Date(),
    });
    const saved = await this.repo.save(entity);
    return toAllergenResponse(saved);
  }

  async findAll(userId: string) {
    const list = await this.repo.find({ where: { userId } });
    return list.map(toAllergenResponse);
  }

  async findOne(userId: string, id: string) {
    const allergen = await this.repo.findOne({ where: { alerjenId: id, userId } });
    if (!allergen) throw new NotFoundException('Allergen not found');
    return toAllergenResponse(allergen);
  }
}
