import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckService } from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private healthCheckService: HealthCheckService,
    @InjectDataSource() private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async health(): Promise<any> {
    // Perform a comprehensive health check
    const dbCheck = async (): Promise<HealthIndicatorResult> => {
      try {
        await this.dataSource.query('SELECT 1');
        return { database: { status: 'up', ping: 'ok' } };
      } catch (error: any) {
        return { database: { status: 'down', error: error.message } };
      }
    };

    // Check Redis connection (for queue system)
    const redisCheck = async (): Promise<HealthIndicatorResult> => {
      if (process.env.DISABLE_REDIS === 'true') {
        return { redis: { status: 'up', disabled: true } };
      }

      try {
        const Redis = require('ioredis');
        const url = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        const redis = new Redis(url, { 
          lazyConnect: true, 
          maxRetriesPerRequest: 1, 
          enableReadyCheck: true,
          connectTimeout: 2000,
          commandTimeout: 2000
        });

        // Connect and ping
        await redis.connect();
        const ping = await redis.ping();
        await redis.disconnect();
        
        return { redis: { status: 'up', ping: typeof ping === 'string' ? ping : 'ok' } };
      } catch (error: any) {
        return { redis: { status: 'down', error: error.message } };
      }
    };

    // Check basic application status
    const appCheck = async (): Promise<HealthIndicatorResult> => {
      return { 
        application: { 
          status: 'up',
          uptime: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.1.0'
        } 
      };
    };

    // Run all health checks
    return this.healthCheckService.check([
      dbCheck,
      redisCheck,
      appCheck
    ]);
  }

  // Simple health check without detailed health indicators
  simpleHealth() {
    return { status: 'ok', ts: new Date().toISOString() };
  }
}
