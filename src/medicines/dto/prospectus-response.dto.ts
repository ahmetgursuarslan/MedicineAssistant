import { ApiProperty } from '@nestjs/swagger';

export class ProspectusResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() medicineId: string;
  @ApiProperty() description: string;
  @ApiProperty() createdBy: string;
  @ApiProperty() registeredAt: Date;
  @ApiProperty({ nullable: true }) updatedAt?: Date | null;
}
