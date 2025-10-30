import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder } from '../entities/reminder';
// Using centralized queue service now
import { ReminderQueueService } from '../queue/reminder-queue.service';
import { REMINDER_QUEUE } from '../queue/reminder-queue.constants';
import { ReminderStatus } from '../entities/enums';

@Injectable()
export class ReminderEnqueueService implements OnModuleInit {
  private readonly logger = new Logger(ReminderEnqueueService.name);
  private isDisabled = false;

  constructor(
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
    private readonly reminderQueue: ReminderQueueService,
  ) {
    // Disable scheduled jobs during OpenAPI generation
    if (process.env.GENERATE_OPENAPI === 'true') {
      this.isDisabled = true;
    }
  }

  async onModuleInit() {
    if (this.isDisabled) {
      this.logger.log('OpenAPI generation mode: skipping scheduled reminder enqueue service.');
      return;
    }
  }

  // Her 5 dakikada bir önümüzdeki 5 dakika içinde tetikleme zamanı gelmiş PLANNED reminder'ları kuyruğa al.
  @Cron(CronExpression.EVERY_5_MINUTES)
  async enqueueDue() {
    if (this.isDisabled) return; // Skip execution in OpenAPI generation mode
    
    // Queue yoksa (örn. docs generation) sessizce çık
    // reminderQueue.enqueueDispatch zaten null queue'yu kontrol ediyor.
    const now = new Date();
    const horizon = new Date(now.getTime() + 5 * 60 * 1000);
    const due = await this.reminders.find({
      where: {
        reminderStatus: ReminderStatus.PLANNED,
        reminderExecutionTime: LessThanOrEqual(horizon),
      },
      take: 200,
    });
    if (!due.length) return;
    for (const r of due) {
      await this.reminderQueue.enqueueDispatch(r.reminderId, r.reminderExecutionTime);
      r.reminderStatus = ReminderStatus.QUEUED;
      await this.reminders.save(r);
    }
    this.logger.log(`Enqueued ${due.length} reminders to ${REMINDER_QUEUE}`);
  }
}
