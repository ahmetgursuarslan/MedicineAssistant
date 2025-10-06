import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company';
import { CreateCompanyDto } from './dto/create-company.dto';
import { toCompanyResponse } from './mappers/company.mapper';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private readonly repo: Repository<Company>) {}

  async create(userId: string, dto: CreateCompanyDto) {
    const entity = this.repo.create({
      companyName: dto.name,
      companyCountry: dto.country,
      companyCreatedBy: userId,
      companyRegistrationDate: new Date(),
      user: { userId } as any,
    });
    const saved = await this.repo.save(entity);
    return toCompanyResponse(saved);
  }

  async findAll() {
    const list = await this.repo.find();
    return list.map(toCompanyResponse);
  }

  async findOne(id: string) {
    const company = await this.repo.findOne({ where: { companyId: id } });
    if (!company) throw new NotFoundException('Company not found');
    return toCompanyResponse(company);
  }
}
