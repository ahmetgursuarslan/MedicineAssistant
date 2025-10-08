import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user';
import { Company } from './company';
import { MedicineProspectus } from './medicine-prospectus';

@Entity({ name: 'medicine' })
export class Medicine {
  @PrimaryGeneratedColumn('uuid', { name: 'medicine_id' })
  medicineId!: string;

  @Column({ name: 'medicine_created_by', type: 'uuid' })
  medicineCreatedBy!: string;

  @Column({ name: 'medicine_company_id', type: 'uuid' })
  medicineCompanyId!: string;

  @Column({ name: 'medicine_name', type: 'varchar', length: 250 })
  medicineName!: string;

  @Column({ name: 'medicine_registration_date', type: 'timestamptz' })
  medicineRegistrationDate!: Date;

  @Column({ name: 'medicine_update_by', type: 'uuid', nullable: true })
  medicineUpdateBy?: string;

  @Column({ name: 'medicine_update_date', type: 'timestamptz', nullable: true })
  medicineUpdateDate?: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'medicine_created_by', referencedColumnName: 'userId' })
  createdByUser!: User;

  @ManyToOne(() => Company, { nullable: false })
  @JoinColumn({ name: 'medicine_company_id', referencedColumnName: 'companyId' })
  company!: Company;

  @OneToMany(() => MedicineProspectus, (p: MedicineProspectus) => p.medicine, {
    cascade: true,
  })
  prospectus!: MedicineProspectus[];
}
