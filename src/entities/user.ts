import { ParseUUIDPipe } from '@nestjs/common';
import { type } from 'os';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Column({name:'user_id'})
  userId: string;

  @Column({name:'user_email'})
  userEmail: string;

  @Column({name:'user_password'})
  userPassword: string;
  
  @Column({name:'user_registration_date'})
  userRegistrationDate: Date;

  @Column({name:'user_update_date'})
  userUpdateDate: Date;

  @Column({name:'user_active'})
  userActive: boolean;

  @OneToMany(()=> Company, company => company.user )
  companies : Company[];
}