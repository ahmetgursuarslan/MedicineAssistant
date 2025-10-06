import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Medicine } from './medicine';
import { User } from './user';

@Entity({ name: 'medicine_prospectus' })
export class MedicineProspectus {
  @PrimaryGeneratedColumn('uuid', { name: 'prospectus_id' })
  prospectusId!: string;

  @Column({ name: 'medicine_id', type: 'uuid' })
  medicineId!: string;

  @Column({ name: 'prospectus_description', type: 'text' })
  prospectusDescription!: string;

  @Column({ name: 'prospectus_registration_date', type: 'timestamptz' })
  prospectusRegistrationDate!: Date;

  @Column({ name: 'prospectus_created_by', type: 'uuid' })
  prospectusCreatedBy!: string;

  @Column({ name: 'prospectus_update_date', type: 'timestamptz', nullable: true })
  prospectusUpdateDate?: Date;

  @Column({ name: 'prospectus_update_by', type: 'uuid', nullable: true })
  prospectusUpdateBy?: string;

  @ManyToOne(() => Medicine, (m) => m.prospectus, { nullable: false })
  medicine!: Medicine;

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;
}
