import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Timer } from './timer';
import { ReminderStatus } from './enums';

@Entity({ name: 'reminder' })
export class Reminder {
  @PrimaryGeneratedColumn({ name: 'reminder_id' })
  reminderId!: number;

  @Column({ name: 'timer_id', type: 'uuid' })
  timerId!: string;

  @Column({ name: 'reminder_execution_time', type: 'timestamptz' })
  reminderExecutionTime!: Date;

  @Column({ name: 'reminder_status', type: 'enum', enum: ReminderStatus })
  reminderStatus!: ReminderStatus;

  @ManyToOne(() => Timer, (t: Timer) => t.reminders, { nullable: false })
  timer!: Timer;
}
