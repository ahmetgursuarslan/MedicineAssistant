import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false, nullable: true })
  updatedAt?: Date | null;

  @ApiProperty()
  registeredAt: Date;
}
