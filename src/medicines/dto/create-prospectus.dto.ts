import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateProspectusDto {
  @ApiProperty()
  @IsUUID()
  medicineId: string;

  @ApiProperty({ description: 'Prospektüs açıklaması (metin)' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10000)
  description: string;
}
