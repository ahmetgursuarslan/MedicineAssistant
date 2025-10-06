import { ApiProperty } from '@nestjs/swagger';

export class MedicineResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() companyId: string;
  @ApiProperty() createdBy: string;
  @ApiProperty() registeredAt: Date;
  @ApiProperty({ nullable: true }) updatedAt?: Date | null;
}
