import { Medicine } from '../../entities/medicine';
import { MedicineResponseDto } from '../dto/medicine-response.dto';

export function toMedicineResponse(entity: Medicine): MedicineResponseDto {
  return {
    id: entity.medicineId,
    name: entity.medicineName,
    companyId: entity.medicineCompanyId,
    createdBy: entity.medicineCreatedBy,
    registeredAt: entity.medicineRegistrationDate,
    updatedAt: entity.medicineUpdateDate ?? null,
  };
}
