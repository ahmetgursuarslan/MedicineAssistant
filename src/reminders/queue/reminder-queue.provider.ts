import { FactoryProvider } from '@nestjs/common';
import { Queue } from 'bullmq';
import { REMINDER_QUEUE, REMINDER_QUEUE_TOKEN } from './reminder-queue.constants';

export const ReminderQueueProvider: FactoryProvider = {
  provide: REMINDER_QUEUE_TOKEN,
  useFactory: () => {
    if (process.env.GENERATE_OPENAPI === 'true') {
      // Skip real queue during spec generation
      return null;
    }
    const connection = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } };
    return new Queue(REMINDER_QUEUE, connection);
  },
};
