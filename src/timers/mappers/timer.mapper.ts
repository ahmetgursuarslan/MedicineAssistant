import { Timer } from '../../entities/timer';
import { TimerResponseDto } from '../dto/timer-response.dto';

export function toTimerResponse(entity: Timer): TimerResponseDto {
  return {
    id: entity.timerId,
    medicineId: entity.medicineId,
    userId: entity.userId,
    medicineCount: entity.medicineCount,
    dailyType: entity.timerDailyType,
    startDate: entity.timerStartDate,
    finishDate: entity.timerFinishDate,
    weeklyType: entity.timerWeeklyType,
  };
}
