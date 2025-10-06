import { Disease } from '../../entities/disease';
import { DiseaseResponseDto } from '../dto/disease-response.dto';

export function toDiseaseResponse(entity: Disease): DiseaseResponseDto {
  return {
    id: entity.diseasesId,
    name: entity.diseasesName,
    description: entity.diseasesDescription,
    recordedAt: entity.diseasesRecordDate,
    updatedAt: entity.diseasesUpdateDate ?? null,
  };
}
