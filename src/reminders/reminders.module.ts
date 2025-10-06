import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from '../entities/reminder';
import { Timer } from '../entities/timer';
import { ReminderPlannerService } from './reminder-planner.service';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ReminderEnqueueService } from './reminder-enqueue.service';
import { ReminderQueueProvider } from './queue/reminder-queue.provider';
import { ReminderWorker } from './queue/reminder.worker';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, Timer])],
  providers: [RemindersService, ReminderPlannerService, ReminderEnqueueService, ReminderQueueProvider, ReminderWorker],
  controllers: [RemindersController],
  exports: [RemindersService],
})
export class RemindersModule {}
