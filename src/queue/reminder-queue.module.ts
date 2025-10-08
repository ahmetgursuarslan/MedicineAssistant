import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from '../entities/reminder';
import { ReminderQueueProvider } from './reminder-queue.provider';
import { ReminderWorker } from './reminder.worker';
import { ReminderQueueService } from './reminder-queue.service';

// Global so any feature can inject the queue without re-importing
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  providers: [ReminderQueueProvider, ReminderWorker, ReminderQueueService],
  exports: [ReminderQueueProvider, ReminderQueueService],
})
export class ReminderQueueModule {}
