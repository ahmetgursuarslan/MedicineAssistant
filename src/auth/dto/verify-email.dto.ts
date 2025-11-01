import { IsString, IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsUUID()
  token: string;
}