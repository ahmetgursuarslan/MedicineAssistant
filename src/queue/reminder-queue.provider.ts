import { FactoryProvider, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { REMINDER_QUEUE, REMINDER_QUEUE_TOKEN } from './reminder-queue.constants';

const logger = new Logger('ReminderQueueProvider');

export const ReminderQueueProvider: FactoryProvider = {
  provide: REMINDER_QUEUE_TOKEN,
  useFactory: async () => {
    if (process.env.GENERATE_OPENAPI === 'true') {
      return null; // skip real queue during spec generation
    }
    if (process.env.DISABLE_REDIS === 'true') {
      logger.warn('Redis explicitly disabled via DISABLE_REDIS env. Reminder queue inactive.');
      return null;
    }
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    // Lightweight reachability test (ping) before instantiating BullMQ objects
    try {
      // Dynamically require to avoid issues if dependency tree changes
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Redis = require('ioredis');
      const tmp = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 1, enableReadyCheck: true });
      const ping = await tmp.ping().catch((e: any) => { throw e; });
      await tmp.quit();
      if (ping !== 'PONG') {
        logger.warn(`Unexpected Redis PING response (${ping}). Queue disabled.`);
        return null;
      }
      logger.log(`Redis reachable at ${url}. Reminder queue enabled.`);
      return new Queue(REMINDER_QUEUE, { connection: { url } });
    } catch (err: any) {
      logger.warn(`Redis not reachable at ${url} (${err?.code || err?.message}). Reminder queue disabled.`);
      return null; // degrade gracefully
    }
  },
};
