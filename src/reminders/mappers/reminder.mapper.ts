import { Reminder } from '../../entities/reminder';
import { ReminderResponseDto } from '../dto/reminder-response.dto';

export function toReminderResponse(entity: Reminder): ReminderResponseDto {
  return {
    id: entity.reminderId,
    timerId: entity.timerId,
    executionTime: entity.reminderExecutionTime,
    status: entity.reminderStatus,
  };
}
