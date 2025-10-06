import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Company } from './company';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId!: string;

  @Index('uq_user_email', { unique: true })
  @Column({ name: 'user_email', type: 'varchar', length: 200 })
  userEmail!: string;

  @Column({ name: 'user_password', type: 'varchar', length: 512 })
  userPassword!: string;

  @Column({ name: 'user_registration_date', type: 'timestamptz' })
  userRegistrationDate!: Date;

  @Column({ name: 'user_update_date', type: 'timestamptz', nullable: true })
  userUpdateDate!: Date | null;

  @Column({ name: 'user_active', type: 'boolean', default: true })
  userActive!: boolean;

  @Column({ name: 'user_role', type: 'varchar', length: 20, default: 'user' })
  userRole!: string;

  @OneToMany(() => Company, (company) => company.user)
  companies!: Company[];
}