import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationAndPasswordReset1730512345678 implements MigrationInterface {
  name = 'AddEmailVerificationAndPasswordReset1730512345678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "email_verified" boolean DEFAULT false,
      ADD COLUMN "email_verification_token" varchar,
      ADD COLUMN "email_verification_expires" timestamptz,
      ADD COLUMN "password_reset_token" varchar,
      ADD COLUMN "password_reset_expires" timestamptz
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "email_verified",
      DROP COLUMN "email_verification_token",
      DROP COLUMN "email_verification_expires",
      DROP COLUMN "password_reset_token",
      DROP COLUMN "password_reset_expires"
    `);
  }
}