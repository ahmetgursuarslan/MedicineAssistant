import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { REMINDER_JOB_DISPATCH, REMINDER_QUEUE_TOKEN } from './reminder-queue.constants';

@Injectable()
export class ReminderQueueService {
  private readonly logger = new Logger(ReminderQueueService.name);
  constructor(@Inject(REMINDER_QUEUE_TOKEN) private readonly queue: Queue | null) {}

  async enqueueDispatch(reminderId: number, executeAt: Date) {
    if (!this.queue) return; // spec generation path
    await this.queue.add(
      REMINDER_JOB_DISPATCH,
      { reminderId, executeAt },
      { delay: 0, attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
    );
    this.logger.debug(`Enqueued reminder ${reminderId}`);
  }
}
