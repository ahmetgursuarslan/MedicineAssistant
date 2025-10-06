import { ApiProperty } from '@nestjs/swagger';

export class AllergenResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() recordedAt: Date;
  @ApiProperty({ nullable: true, required: false }) updatedAt?: Date | null;
}
