import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Medicine } from './medicine';
import { Reminder } from './reminder';
import { DailyType, WeeklyType } from './enums';

@Entity({ name: 'timer' })
export class Timer {
  @PrimaryGeneratedColumn('uuid', { name: 'timer_id' })
  timerId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'medicine_id', type: 'uuid' })
  medicineId!: string;

  @Column({ name: 'medicine_count', type: 'numeric', precision: 10, scale: 2 })
  medicineCount!: string;

  @Column({ name: 'timer_daily_type', type: 'enum', enum: DailyType })
  timerDailyType!: DailyType;

  @Column({ name: 'timer_start_date', type: 'timestamptz' })
  timerStartDate!: Date;

  @Column({ name: 'timer_finish_date', type: 'timestamptz' })
  timerFinishDate!: Date;

  @Column({ name: 'timer_weekly_type', type: 'enum', enum: WeeklyType })
  timerWeeklyType!: WeeklyType;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Medicine, { nullable: false })
  medicine!: Medicine;

  @OneToMany(() => Reminder, (r: Reminder) => r.timer, { cascade: true })
  reminders!: Reminder[];
}
