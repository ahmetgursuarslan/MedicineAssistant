import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { DiseasesModule } from '../diseases/diseases.module';
import { AllergensModule } from '../allergens/allergens.module';
import { MedicinesModule } from '../medicines/medicines.module';
import { TimersModule } from '../timers/timers.module';
import { RemindersModule } from '../reminders/reminders.module';
import { RiskModule } from '../risk/risk.module';

// Minimal module for generating OpenAPI spec without booting queues/schedulers/workers
@Module({
  imports: [
    // Provide config & lightweight in-memory DB so repositories can resolve
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'sqlite',
          database: ':memory:',
          entities: [],
          synchronize: false,
          autoLoadEntities: true,
          logging: false, // Disable logging for OpenAPI generation
        };
      },
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    DiseasesModule,
    AllergensModule,
    MedicinesModule,
    TimersModule,
    RemindersModule,
    RiskModule,
  ],
})
export class DocsModule {}
