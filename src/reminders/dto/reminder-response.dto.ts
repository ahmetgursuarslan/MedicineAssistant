import { ApiProperty } from '@nestjs/swagger';
import { ReminderStatus } from '../../entities/enums';

export class ReminderResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() timerId: string;
  @ApiProperty() executionTime: Date;
  @ApiProperty({ enum: ReminderStatus }) status: ReminderStatus;
}
