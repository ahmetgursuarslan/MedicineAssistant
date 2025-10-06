import { OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../../entities/reminder';
import { ReminderStatus } from '../../entities/enums';
import { REMINDER_QUEUE, REMINDER_QUEUE_TOKEN } from './reminder-queue.constants';

export class ReminderWorker implements OnModuleInit {
  private worker?: Worker;
  constructor(
    @Inject(REMINDER_QUEUE_TOKEN) private readonly queue: Queue | null,
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
  ) {}

  onModuleInit() {
    if (!this.queue) return; // skip in spec generation
    this.worker = new Worker(
      REMINDER_QUEUE,
      async (job) => {
        const { reminderId } = job.data as { reminderId: number };
        const reminder = await this.reminders.findOne({ where: { reminderId } });
        if (!reminder) return;
        // Simule gönderim (ileride push bildirimi / e-posta vb.)
        reminder.reminderStatus = ReminderStatus.SENT;
        await this.reminders.save(reminder);
        return { status: 'sent' };
      },
      { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } },
    );
  }
}
