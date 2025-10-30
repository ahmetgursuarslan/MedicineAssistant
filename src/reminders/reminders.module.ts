import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from '../entities/reminder';
import { Timer } from '../entities/timer';
import { ReminderPlannerService } from './reminder-planner.service';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ReminderEnqueueService } from './reminder-enqueue.service';
// Queue provider & worker artık global queue module içinde yönetiliyor.

import { ReminderQueueModule } from '../queue/reminder-queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, Timer]), ReminderQueueModule],
  providers: [RemindersService, ReminderPlannerService, ReminderEnqueueService],
  controllers: [RemindersController],
  exports: [RemindersService],
})
export class RemindersModule {}
