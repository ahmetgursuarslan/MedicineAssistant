import { ParseUUIDPipe } from '@nestjs/common';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, TableColumn } from 'typeorm';
import { User } from './user';

@Entity({name:'company'} )
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Column({name:'company_id'})
  companyId: string;

  @Column({name:'company_created_by',type:'uuid'} )
  companyCreatedBy: string;

  @Column({name:'company_name'})
  companyName: string;
  
  @Column({name:'company_country'})
  companyCountry: string;

  @Column({name:'company_registration_date'})
  companyRegistrationDate: Date;

  @ManyToOne(()=>User, user => user.companies)
  user: User;
}