import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity({ name: 'alerjens' })
export class Allergen {
  @PrimaryGeneratedColumn('uuid', { name: 'alerjen_id' })
  alerjenId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'alerjen_name', type: 'varchar', length: 200 })
  alerjenName: string;

  @Column({ name: 'alerjen_description', type: 'varchar', length: 1000 })
  alerjenDescription: string;

  @Column({ name: 'alerjen_record_date', type: 'timestamptz' })
  alerjenRecordDate: Date;

  @Column({ name: 'alerjen_update_date', type: 'timestamptz', nullable: true })
  alerjenUpdateDate?: Date;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}
