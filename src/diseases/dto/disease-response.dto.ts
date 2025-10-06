import { ApiProperty } from '@nestjs/swagger';

export class DiseaseResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  recordedAt: Date;
  @ApiProperty({ required: false, nullable: true })
  updatedAt?: Date | null;
}
