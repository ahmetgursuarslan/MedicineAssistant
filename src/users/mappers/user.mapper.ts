import { User } from '../../entities/user';
import { UserResponseDto } from '../dto/user-response.dto';

export function toUserResponse(entity: User): UserResponseDto {
  return {
    id: entity.userId,
    email: entity.userEmail,
    active: entity.userActive,
    role: entity.userRole,
    updatedAt: entity.userUpdateDate ?? null,
    registeredAt: entity.userRegistrationDate,
  };
}
