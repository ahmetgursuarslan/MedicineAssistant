import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity({ name: 'diseases' })
export class Disease {
  @PrimaryGeneratedColumn('uuid', { name: 'diseases_id' })
  diseasesId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'diseases_name', type: 'varchar', length: 200 })
  diseasesName!: string;

  @Column({ name: 'diseases_description', type: 'varchar', length: 1000 })
  diseasesDescription!: string;

  @Column({ name: 'diseases_record_date', type: 'timestamptz' })
  diseasesRecordDate!: Date;

  @Column({ name: 'diseases_update_date', type: 'timestamptz', nullable: true })
  diseasesUpdateDate?: Date;

  @ManyToOne(() => User, { nullable: false })
  user!: User;
}
