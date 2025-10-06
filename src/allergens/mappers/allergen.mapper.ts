import { Allergen } from '../../entities/allergen';
import { AllergenResponseDto } from '../dto/allergen-response.dto';

export function toAllergenResponse(entity: Allergen): AllergenResponseDto {
  return {
    id: entity.alerjenId,
    name: entity.alerjenName,
    description: entity.alerjenDescription,
    recordedAt: entity.alerjenRecordDate,
    updatedAt: entity.alerjenUpdateDate ?? null,
  };
}
