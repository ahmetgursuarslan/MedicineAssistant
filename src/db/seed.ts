import { AppDataSource } from './data-source';
import { User } from '../entities/user';
import { Company } from '../entities/company';
import { Medicine } from '../entities/medicine';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import * as bcrypt from 'bcrypt';

async function seed() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepo = AppDataSource.getRepository(User);
  const companyRepo = AppDataSource.getRepository(Company);
  const medicineRepo = AppDataSource.getRepository(Medicine);
  const prospectusRepo = AppDataSource.getRepository(MedicineProspectus);

  let admin = await userRepo.findOne({ where: { userEmail: 'admin@example.com' } });
  if (!admin) {
    admin = userRepo.create({
      userEmail: 'admin@example.com',
      userPassword: await bcrypt.hash('Admin123!', 12),
      userRegistrationDate: new Date(),
      userActive: true,
    });
    await userRepo.save(admin);
  }

  let sampleCompany = await companyRepo.findOne({ where: { companyName: 'Demo Pharma' } });
  if (!sampleCompany) {
    sampleCompany = companyRepo.create({
      companyCreatedBy: admin.userId,
      companyName: 'Demo Pharma',
      companyCountry: 'TR',
      companyRegistrationDate: new Date(),
    });
    await companyRepo.save(sampleCompany);
  }

  let sampleMedicine = await medicineRepo.findOne({ where: { medicineName: 'DemoMed' } });
  if (!sampleMedicine) {
    sampleMedicine = medicineRepo.create({
      medicineCreatedBy: admin.userId,
      medicineCompanyId: sampleCompany.companyId,
      medicineName: 'DemoMed',
      medicineRegistrationDate: new Date(),
    });
    await medicineRepo.save(sampleMedicine);
  }

  let sampleProspectus = await prospectusRepo.findOne({ where: { medicineId: sampleMedicine.medicineId } });
  if (!sampleProspectus) {
    sampleProspectus = prospectusRepo.create({
      medicineId: sampleMedicine.medicineId,
      prospectusDescription: 'Contains sample substances. Avoid if allergic to DemoSubstance.',
      prospectusRegistrationDate: new Date(),
      prospectusCreatedBy: admin.userId,
    });
    await prospectusRepo.save(sampleProspectus);
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed (admin, company, medicine, prospectus)');
  process.exit(0);
}

seed().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
