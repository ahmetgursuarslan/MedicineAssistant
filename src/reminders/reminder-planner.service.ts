import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timer } from '../entities/timer';
import { Reminder } from '../entities/reminder';
import { ReminderStatus } from '../entities/enums';

// Basit planlayıcı: Her gece 00:05'te (UTC) önümüzdeki 7 gün için eksik reminder'ları üretir.
// Geliştirme: BullMQ kuyruğuna iş ekleme ileride entegre edilecek.
@Injectable()
export class ReminderPlannerService {
  private readonly logger = new Logger(ReminderPlannerService.name);

  constructor(
    @InjectRepository(Timer) private readonly timers: Repository<Timer>,
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async planDaily() {
    // Tarih aralığı: bugün (00:00) -> +7 gün
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.logger.log(`Planning reminders window ${start.toISOString()} - ${end.toISOString()}`);

    const activeTimers = await this.timers.find();

    for (const timer of activeTimers) {
      // Timer tarih aralığı ile kesişen günleri hesapla
      const timerStart = timer.timerStartDate;
      const timerEnd = timer.timerFinishDate;
      const windowStart = timerStart > start ? timerStart : start;
      const windowEnd = timerEnd < end ? timerEnd : end;
      if (windowEnd <= windowStart) continue;

      // Gün bazında iterate
      for (let d = new Date(windowStart); d <= windowEnd; d = new Date(d.getTime() + 24 * 3600 * 1000)) {
        if (!this.matchesWeekly(timer, d)) continue;

        const executionTimes = this.computeDailyExecutions(timer, d);
        for (const execTime of executionTimes) {
          const exists = await this.reminders.findOne({ where: { timerId: timer.timerId, reminderExecutionTime: execTime } });
          if (exists) continue;
          const reminder = this.reminders.create({
            timerId: timer.timerId,
            reminderExecutionTime: execTime,
            reminderStatus: ReminderStatus.PLANNED,
            timer: timer as any,
          });
          await this.reminders.save(reminder);
        }
      }
    }
  }

  private matchesWeekly(timer: Timer, date: Date): boolean {
    // WeeklyType enum bir gün seçimi içeriyor; sadece o gün reminder üret
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    return timer.timerWeeklyType === weekday;
  }

  private computeDailyExecutions(timer: Timer, day: Date): Date[] {
    // Basit mapping: günlük tipine göre eşit aralıklar / sabit sayıda tetikleme
    const base = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 8, 0, 0)); // varsayılan başlangıç 08:00 UTC
    switch (timer.timerDailyType) {
      case 'ONCE':
        return [base];
      case 'TWICE':
        return [base, new Date(base.getTime() + 8 * 3600 * 1000)];
      case 'EVERY_6H':
        return [0, 6, 12, 18].map(h => new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, 0, 0)));
      case 'CUSTOM':
        // CUSTOM henüz tanımlı değil – şimdilik ONCE davranışı
        return [base];
      default:
        return [base];
    }
  }
}
