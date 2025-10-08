import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init00011697202400000 implements MigrationInterface {
  name = 'Init00011697202400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Enums
    await queryRunner.query("CREATE TYPE daily_type_enum AS ENUM ('ONCE','TWICE','EVERY_6H','CUSTOM')");
    await queryRunner.query("CREATE TYPE weekly_type_enum AS ENUM ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY')");
    await queryRunner.query("CREATE TYPE reminder_status_enum AS ENUM ('PLANNED','QUEUED','SENT','SKIPPED','FAILED')");

    // Users
    await queryRunner.query(`CREATE TABLE users (
      user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_email varchar(200) NOT NULL UNIQUE,
      user_password varchar(512) NOT NULL,
      user_registration_date timestamptz NOT NULL,
      user_update_date timestamptz NULL,
      user_active boolean NOT NULL DEFAULT true,
      user_role varchar(20) NOT NULL DEFAULT 'user'
    )`);

    // User Detail
    await queryRunner.query(`CREATE TABLE user_detail (
      user_detail_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      user_name varchar(150) NOT NULL,
      user_surname varchar(100) NOT NULL,
      user_birthday timestamptz NOT NULL,
      user_gender boolean NOT NULL,
      user_height numeric(5,2) NOT NULL,
      user_weight numeric(5,2) NOT NULL,
      user_tel varchar(15),
      CONSTRAINT fk_user_detail_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);

    // Company
    await queryRunner.query(`CREATE TABLE company (
      company_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_created_by uuid NOT NULL,
      company_name varchar(500) NOT NULL,
      company_country varchar(56) NOT NULL,
      company_registration_date timestamptz NOT NULL,
      CONSTRAINT fk_company_user FOREIGN KEY (company_created_by) REFERENCES users(user_id)
    )`);

    // Medicine
    await queryRunner.query(`CREATE TABLE medicine (
      medicine_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      medicine_created_by uuid NOT NULL,
      medicine_company_id uuid NOT NULL,
      medicine_name varchar(250) NOT NULL,
      medicine_registration_date timestamptz NOT NULL,
      medicine_update_by uuid NULL,
      medicine_update_date timestamptz NULL,
      CONSTRAINT fk_med_created_by FOREIGN KEY (medicine_created_by) REFERENCES users(user_id),
      CONSTRAINT fk_med_company FOREIGN KEY (medicine_company_id) REFERENCES company(company_id)
    )`);

    // Prospectus
    await queryRunner.query(`CREATE TABLE medicine_prospectus (
      prospectus_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      medicine_id uuid NOT NULL,
      prospectus_description text NOT NULL,
      prospectus_registration_date timestamptz NOT NULL,
      prospectus_created_by uuid NOT NULL,
      prospectus_update_date timestamptz NULL,
      prospectus_update_by uuid NULL,
      CONSTRAINT fk_prospectus_med FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id),
      CONSTRAINT fk_prospectus_user FOREIGN KEY (prospectus_created_by) REFERENCES users(user_id)
    )`);

    // Timer
    await queryRunner.query(`CREATE TABLE timer (
      timer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      medicine_id uuid NOT NULL,
      medicine_count numeric(10,2) NOT NULL,
      timer_daily_type daily_type_enum NOT NULL,
      timer_start_date timestamptz NOT NULL,
      timer_finish_date timestamptz NOT NULL,
      timer_weekly_type weekly_type_enum NOT NULL,
      CONSTRAINT fk_timer_user FOREIGN KEY (user_id) REFERENCES users(user_id),
      CONSTRAINT fk_timer_med FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id)
    )`);

    // Reminder
    await queryRunner.query(`CREATE TABLE reminder (
      reminder_id serial PRIMARY KEY,
      timer_id uuid NOT NULL,
      reminder_execution_time timestamptz NOT NULL,
      reminder_status reminder_status_enum NOT NULL,
      CONSTRAINT fk_reminder_timer FOREIGN KEY (timer_id) REFERENCES timer(timer_id)
    )`);

    // Diseases
    await queryRunner.query(`CREATE TABLE diseases (
      diseases_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      diseases_name varchar(200) NOT NULL,
      diseases_description varchar(1000) NOT NULL,
      diseases_record_date timestamptz NOT NULL,
      diseases_update_date timestamptz NULL,
      CONSTRAINT fk_diseases_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);

    // Alerjens
    await queryRunner.query(`CREATE TABLE alerjens (
      alerjen_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      alerjen_name varchar(200) NOT NULL,
      alerjen_description varchar(1000) NOT NULL,
      alerjen_record_date timestamptz NOT NULL,
      alerjen_update_date timestamptz NULL,
      CONSTRAINT fk_alerjen_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS alerjens');
    await queryRunner.query('DROP TABLE IF EXISTS diseases');
    await queryRunner.query('DROP TABLE IF EXISTS reminder');
    await queryRunner.query('DROP TABLE IF EXISTS timer');
    await queryRunner.query('DROP TABLE IF EXISTS medicine_prospectus');
    await queryRunner.query('DROP TABLE IF EXISTS medicine');
    await queryRunner.query('DROP TABLE IF EXISTS company');
    await queryRunner.query('DROP TABLE IF EXISTS user_detail');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TYPE IF EXISTS reminder_status_enum');
    await queryRunner.query('DROP TYPE IF EXISTS weekly_type_enum');
    await queryRunner.query('DROP TYPE IF EXISTS daily_type_enum');
  }
}
