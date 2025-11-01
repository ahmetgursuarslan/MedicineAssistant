import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { envValidationSchema } from '../config/env.validation';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { DiseasesModule } from '../diseases/diseases.module';
import { AllergensModule } from '../allergens/allergens.module';
import { MedicinesModule } from '../medicines/medicines.module';
import { TimersModule } from '../timers/timers.module';
import { RemindersModule } from '../reminders/reminders.module';
import { RiskModule } from '../risk/risk.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderQueueModule } from '../queue/reminder-queue.module';
import { HealthAnalyticsModule } from '../common/health-analytics/health-analytics.module';
import { RequestMetricsInterceptor } from '../common/health-analytics/request-metrics.interceptor';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
    TerminusModule,
    ScheduleModule.forRoot(),
    ...(process.env.GENERATE_OPENAPI === 'true'
      ? [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [],
            synchronize: false,
            autoLoadEntities: true,
          }),
        ]
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              host: config.get<string>('DB_HOST'),
              port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASS'),
              database: config.get<string>('DB_NAME'),
              autoLoadEntities: true,
              synchronize: config.get<string>('DB_SYNC') === 'true',
              logging: config.get<string>('DB_LOGGING') === 'true',
            }),
          }),
        ]),
    JwtModule.register({ global: true }),
    ThrottlerModule.forRoot([{ ttl: 900, limit: 100 }]),
    AuthModule,
    UsersModule,
    CompaniesModule,
    DiseasesModule,
    AllergensModule,
    MedicinesModule,
    TimersModule,
    RemindersModule,
  RiskModule,
  ReminderQueueModule,
  HealthAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: RequestMetricsInterceptor },
  ],
})
export class AppModule {}
