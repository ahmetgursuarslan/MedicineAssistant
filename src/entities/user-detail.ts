import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity({ name: 'user_detail' })
export class UserDetail {
  @PrimaryGeneratedColumn('uuid', { name: 'user_detail_id' })
  userDetailId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'user_name', type: 'varchar', length: 150 })
  userName!: string;

  @Column({ name: 'user_surname', type: 'varchar', length: 100 })
  userSurname!: string;

  @Column({ name: 'user_birthday', type: 'timestamptz' })
  userBirthday!: Date;

  @Column({ name: 'user_gender', type: 'boolean' })
  userGender!: boolean;

  @Column({ name: 'user_height', type: 'numeric', precision: 5, scale: 2 })
  userHeight!: string; // numeric mapped as string

  @Column({ name: 'user_weight', type: 'numeric', precision: 5, scale: 2 })
  userWeight!: string;

  @Column({ name: 'user_tel', type: 'varchar', length: 15, nullable: true })
  userTel?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: User;
}
