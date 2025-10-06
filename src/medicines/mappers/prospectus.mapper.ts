import { MedicineProspectus } from '../../entities/medicine-prospectus';
import { ProspectusResponseDto } from '../dto/prospectus-response.dto';

export function toProspectusResponse(entity: MedicineProspectus): ProspectusResponseDto {
  return {
    id: entity.prospectusId,
    medicineId: entity.medicineId,
    description: entity.prospectusDescription,
    createdBy: entity.prospectusCreatedBy,
    registeredAt: entity.prospectusRegistrationDate,
    updatedAt: entity.prospectusUpdateDate ?? null,
  };
}
