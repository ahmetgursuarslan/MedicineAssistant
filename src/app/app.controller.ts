import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheck, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Comprehensive health check' })
  @ApiResponse({ status: 200, description: 'Returns the health status of all services' })
  health(): Promise<HealthIndicatorResult> {
    return this.appService.health();
  }
  
  @Get('simple-health')
  @ApiOperation({ summary: 'Simple health check' })
  @ApiResponse({ status: 200, description: 'Returns basic health status' })
  simpleHealth() {
    return this.appService.simpleHealth();
  }
}
