import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timer } from '../entities/timer';
import { CreateTimerDto } from './dto/create-timer.dto';
import { toTimerResponse } from './mappers/timer.mapper';

@Injectable()
export class TimersService {
  constructor(@InjectRepository(Timer) private readonly repo: Repository<Timer>) {}

  async create(userId: string, dto: CreateTimerDto) {
    const entity = this.repo.create({
      userId,
      medicineId: dto.medicineId,
      medicineCount: dto.medicineCount,
      timerDailyType: dto.dailyType,
      timerStartDate: new Date(dto.startDate),
      timerFinishDate: new Date(dto.finishDate),
      timerWeeklyType: dto.weeklyType,
    });
    const saved = await this.repo.save(entity);
    return toTimerResponse(saved);
  }

  async list(userId: string) {
    const list = await this.repo.find({ where: { userId } });
    return list.map(toTimerResponse);
  }

  async get(userId: string, id: string) {
    const timer = await this.repo.findOne({ where: { timerId: id, userId } });
    if (!timer) throw new NotFoundException('Timer not found');
    return toTimerResponse(timer);
  }
}
