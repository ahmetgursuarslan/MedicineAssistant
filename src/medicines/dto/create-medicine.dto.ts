import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsUUID } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ description: 'İlacın bağlı olduğu şirket ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'İlaç adı' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;
}
