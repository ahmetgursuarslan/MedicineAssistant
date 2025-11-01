import { Controller, Get, Query } from '@nestjs/common';
import { HealthAnalyticsService } from './health-analytics.service';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Health Analytics')
@Controller('health-analytics')
export class HealthAnalyticsController {
  constructor(private readonly healthAnalyticsService: HealthAnalyticsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get comprehensive health analytics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns comprehensive health analytics data including app metrics, DB metrics, system metrics, and request metrics' 
  })
  async getAnalytics() {
    return await this.healthAnalyticsService.getAnalytics();
  }

  @Get('/app')
  @ApiOperation({ summary: 'Get application-specific metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns application-specific metrics like uptime, version, memory usage' 
  })
  async getAppMetrics() {
    const fullData = await this.healthAnalyticsService.getAnalytics();
    return fullData.appMetrics;
  }

  @Get('/db')
  @ApiOperation({ summary: 'Get database performance metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns database-specific metrics like entity count, connections, query performance' 
  })
  async getDbMetrics() {
    const fullData = await this.healthAnalyticsService.getAnalytics();
    return fullData.dbMetrics;
  }

  @Get('/system')
  @ApiOperation({ summary: 'Get system resource metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns system-specific metrics like CPU, memory, disk usage' 
  })
  async getSystemMetrics() {
    const fullData = await this.healthAnalyticsService.getAnalytics();
    return fullData.systemMetrics;
  }

  @Get('/requests')
  @ApiOperation({ summary: 'Get request performance metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns request-specific metrics like response times, error rates' 
  })
  async getRequestMetrics() {
    const fullData = await this.healthAnalyticsService.getAnalytics();
    return fullData.requestMetrics;
  }

  @Get('/status')
  @ApiOperation({ summary: 'Get overall health status summary' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a summary health status based on all metrics' 
  })
  async getHealthStatus() {
    const fullData = await this.healthAnalyticsService.getAnalytics();
    
    // Determine overall health status based on metrics
    const isAppHealthy = fullData.appMetrics.uptime > 0;
    const isSystemHealthy = fullData.systemMetrics.freeMemory > 0;
    const isDbHealthy = fullData.dbMetrics.connections > 0 || fullData.dbMetrics.entitiesCount >= 0;

    return {
      status: isAppHealthy && isSystemHealthy && isDbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        app: isAppHealthy ? 'healthy' : 'unhealthy',
        system: isSystemHealthy ? 'healthy' : 'unhealthy',
        database: isDbHealthy ? 'healthy' : 'unhealthy',
      }
    };
  }
}