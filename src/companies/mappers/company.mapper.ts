import { Company } from '../../entities/company';
import { CompanyResponseDto } from '../dto/company-response.dto';

export function toCompanyResponse(entity: Company): CompanyResponseDto {
  return {
    id: entity.companyId,
    name: entity.companyName,
    country: entity.companyCountry,
    createdBy: entity.companyCreatedBy,
    registeredAt: entity.companyRegistrationDate,
  };
}
