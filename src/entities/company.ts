import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity({ name: 'company' })
export class Company {
  @PrimaryGeneratedColumn('uuid', { name: 'company_id' })
  companyId!: string;

  @Column({ name: 'company_created_by', type: 'uuid' })
  companyCreatedBy!: string;

  @Column({ name: 'company_name', type: 'varchar', length: 500 })
  companyName!: string;

  @Column({ name: 'company_country', type: 'varchar', length: 56 })
  companyCountry!: string;

  @Column({ name: 'company_registration_date', type: 'timestamptz' })
  companyRegistrationDate!: Date;

  @ManyToOne(() => User, (user) => user.companies, { nullable: false })
  user!: User;
}