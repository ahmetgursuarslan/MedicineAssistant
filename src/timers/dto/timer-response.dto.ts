import { ApiProperty } from '@nestjs/swagger';
import { DailyType, WeeklyType } from '../../entities/enums';

export class TimerResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() medicineId: string;
  @ApiProperty() userId: string;
  @ApiProperty() medicineCount: string;
  @ApiProperty({ enum: DailyType }) dailyType: DailyType;
  @ApiProperty() startDate: Date;
  @ApiProperty() finishDate: Date;
  @ApiProperty({ enum: WeeklyType }) weeklyType: WeeklyType;
}
