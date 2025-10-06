import { ApiProperty } from '@nestjs/swagger';

export class RiskResponseDto {
  @ApiProperty() medicineId: string;
  @ApiProperty() riskScore: number; // 0-100
  @ApiProperty({ type: [String] }) matchedAllergens: string[];
  @ApiProperty({ type: [String] }) matchedDiseases: string[];
  @ApiProperty() totalAllergens: number;
  @ApiProperty() totalDiseases: number;
}
