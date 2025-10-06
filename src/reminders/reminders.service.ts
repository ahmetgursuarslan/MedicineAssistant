import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder';
import { toReminderResponse } from './mappers/reminder.mapper';

@Injectable()
export class RemindersService {
  constructor(@InjectRepository(Reminder) private readonly repo: Repository<Reminder>) {}

  async list(timerId: string) {
    const list = await this.repo.find({ where: { timerId } });
    return list.map(toReminderResponse);
  }

  async get(id: number) {
    const reminder = await this.repo.findOne({ where: { reminderId: id } });
    if (!reminder) throw new NotFoundException('Reminder not found');
    return toReminderResponse(reminder);
  }
}
