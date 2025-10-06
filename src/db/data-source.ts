import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { User } from '../entities/user';
import { Company } from '../entities/company';
import { UserDetail } from '../entities/user-detail';
import { Medicine } from '../entities/medicine';
import { MedicineProspectus } from '../entities/medicine-prospectus';
import { Timer } from '../entities/timer';
import { Reminder } from '../entities/reminder';
import { Disease } from '../entities/disease';
import { Allergen } from '../entities/allergen';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === 'true',
  synchronize: false,
  entities: [
    User,
    UserDetail,
    Company,
    Medicine,
    MedicineProspectus,
    Timer,
    Reminder,
    Disease,
    Allergen,
  ],
  migrations: ['src/db/migrations/*.ts'],
});

export default AppDataSource;
