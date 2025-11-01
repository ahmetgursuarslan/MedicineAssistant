import { Module } from '@nestjs/common';
import { HealthAnalyticsService } from './health-analytics.service';
import { HealthAnalyticsController } from './health-analytics.controller';
import { RequestMetricsInterceptor } from './request-metrics.interceptor';

@Module({
  controllers: [HealthAnalyticsController],
  providers: [HealthAnalyticsService, RequestMetricsInterceptor],
  exports: [HealthAnalyticsService, RequestMetricsInterceptor],
})
export class HealthAnalyticsModule {}