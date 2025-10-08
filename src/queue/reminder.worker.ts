import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder';
import { ReminderStatus } from '../entities/enums';
import { REMINDER_QUEUE, REMINDER_QUEUE_TOKEN, REMINDER_JOB_DISPATCH } from './reminder-queue.constants';

@Injectable()
export class ReminderWorker implements OnApplicationBootstrap {
  private worker?: Worker;
  private readonly logger = new Logger(ReminderWorker.name);
  constructor(
    @Inject(REMINDER_QUEUE_TOKEN) private readonly queue: Queue | null,
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
  ) {}

  onApplicationBootstrap() {
    if (!this.queue) {
      this.logger.warn('Reminder queue disabled (no Redis). Worker not started.');
      return; // graceful noop
    }
    this.worker = new Worker(
      REMINDER_QUEUE,
      async (job) => {
        if (job.name !== REMINDER_JOB_DISPATCH) return;
        const { reminderId } = job.data as { reminderId: number };
        const reminder = await this.reminders.findOne({ where: { reminderId } });
        if (!reminder) return;
        reminder.reminderStatus = ReminderStatus.SENT;
        await this.reminders.save(reminder);
        return { status: 'sent' };
      },
      {
        connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
        concurrency: 5,
        removeOnComplete: { age: 3600, count: 1000 },
        removeOnFail: { age: 24 * 3600 },
      },
    );
    this.worker.on('completed', (job) => this.logger.debug(`Completed job ${job.id}`));
    this.worker.on('failed', (job, err) => this.logger.error(`Failed job ${job?.id}: ${err.message}`));
  }
}

