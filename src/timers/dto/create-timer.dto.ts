import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDateString, IsNumberString } from 'class-validator';
import { DailyType, WeeklyType } from '../../entities/enums';

export class CreateTimerDto {
  @ApiProperty() @IsUUID() medicineId: string;
  @ApiProperty() @IsNumberString() medicineCount: string; // numeric as string
  @ApiProperty({ enum: DailyType }) @IsEnum(DailyType) dailyType: DailyType;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() finishDate: string;
  @ApiProperty({ enum: WeeklyType }) @IsEnum(WeeklyType) weeklyType: WeeklyType;
}
