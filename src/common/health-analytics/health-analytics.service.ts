import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as os from 'os';
import { RequestMetricsInterceptor } from './request-metrics.interceptor';

// Define types for tracking metrics
interface RequestStat {
  timestamp: number;
  method: string;
  url: string;
  responseTime: number;
  statusCode: number;
}

interface HealthAnalyticsData {
  appMetrics: AppMetrics;
  dbMetrics: DbMetrics;
  systemMetrics: SystemMetrics;
  requestMetrics: RequestMetrics;
}

interface AppMetrics {
  uptime: number;
  version: string;
  nodeVersion: string;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: string;
}

interface DbMetrics {
  entitiesCount: number;
  connections: number;
  tablesCount: number;
  totalRows: number;
  avgResponseTime: number;
  slowQueries: number;
  recentErrors: number;
}

interface SystemMetrics {
  platform: string;
  arch: string;
  cpuCount: number;
  cpuUsage: NodeJS.CpuUsage;
  totalMemory: number;
  freeMemory: number;
  loadAverage: number[];
  diskUsage: { total: number; free: number; used: number };
}

interface RequestMetrics {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  topEndpoints: string[];
  recentRequests: RequestStat[];
}

@Injectable()
export class HealthAnalyticsService {
  private readonly logger = new Logger(HealthAnalyticsService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAnalytics(): Promise<HealthAnalyticsData> {
    return {
      appMetrics: await this.getAppMetrics(),
      dbMetrics: await this.getDbMetrics(),
      systemMetrics: await this.getSystemMetrics(),
      requestMetrics: await this.getRequestMetrics(),
    };
  }

  private async getAppMetrics(): Promise<AppMetrics> {
    return {
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.1.0',
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  private async getDbMetrics(): Promise<DbMetrics> {
    try {
      // Get various database metrics depending on the database type
      if (this.dataSource.options.type === 'postgres') {
        // PostgreSQL-specific queries for comprehensive DB metrics
        const [tablesResult, userCountResult, totalRowsResult] = await Promise.all([
          this.dataSource.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
          `),
          this.dataSource.query('SELECT COUNT(*) as count FROM users'),
          this.dataSource.query(`
            SELECT 
              SUM(n_tup_ins + n_tup_upd - n_tup_del) as total_rows
            FROM pg_stat_user_tables
          `)
        ]);

        const tablesCount = parseInt(tablesResult[0]?.count || '0');
        const entitiesCount = parseInt(userCountResult[0]?.count || '0');
        const totalRows = parseInt(totalRowsResult[0]?.total_rows || '0');

        return {
          entitiesCount,
          connections: this.dataSource.isInitialized ? 1 : 0, // Simplified
          tablesCount,
          totalRows,
          avgResponseTime: 0, // Would need actual query timing
          slowQueries: 0, // Would need query logging
          recentErrors: 0, // Would need error tracking
        };
      } else {
        // For other database types, use generic queries
        const userCountResult = await this.dataSource.query('SELECT COUNT(*) as count FROM users');
        const entitiesCount = parseInt(userCountResult[0]?.count || '0');
        
        return {
          entitiesCount,
          connections: this.dataSource.isInitialized ? 1 : 0,
          tablesCount: 0, // Would need database-specific query
          totalRows: 0, // Would need database-specific query
          avgResponseTime: 0,
          slowQueries: 0,
          recentErrors: 0,
        };
      }
    } catch (error) {
      this.logger.error('Error getting DB metrics', error);
      return {
        entitiesCount: 0,
        connections: 0,
        tablesCount: 0,
        totalRows: 0,
        avgResponseTime: 0,
        slowQueries: 0,
        recentErrors: 0,
      };
    }
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    return {
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: os.cpus().length,
      cpuUsage: process.cpuUsage(),
      totalMemory,
      freeMemory,
      loadAverage: os.loadavg(),
      diskUsage: this.getDiskUsage(),
    };
  }

  private getDiskUsage(): { total: number; free: number; used: number } {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      return { 
        total: totalMem, 
        free: freeMem, 
        used: usedMem 
      };
    } catch (error) {
      return { total: 0, free: 0, used: 0 };
    }
  }

  private async getRequestMetrics(): Promise<RequestMetrics> {
    const requestStats = RequestMetricsInterceptor.getRequestStats();
    
    if (requestStats.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        topEndpoints: [],
        recentRequests: [],
      };
    }

    // Calculate metrics from recorded request stats
    const totalRequests = requestStats.length;
    const totalResponseTime = requestStats.reduce((sum, stat) => sum + stat.responseTime, 0);
    const avgResponseTime = totalResponseTime / totalRequests;
    
    const errorCount = requestStats.filter(stat => stat.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;
    
    // Get top endpoints by request count
    const endpointCounts: { [key: string]: number } = requestStats.reduce((acc, stat) => {
      acc[stat.url] = (acc[stat.url] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const topEndpoints = Object.entries(endpointCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([url, count]) => `${url} (${count as number})`);

    return {
      totalRequests,
      avgResponseTime,
      errorRate,
      topEndpoints,
      recentRequests: requestStats.slice(-10), // Last 10 requests
    };
  }

  // Method to clear old stats periodically
  clearOldStats() {
    RequestMetricsInterceptor.clearOldStats();
  }
}