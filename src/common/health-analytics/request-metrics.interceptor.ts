import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Simple interface for tracking request stats in a temporary way
interface RequestStat {
  timestamp: number;
  method: string;
  url: string;
  responseTime: number;
  statusCode: number;
}

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  private static requestStats: RequestStat[] = [];
  
  constructor(
    private readonly reflector: Reflector,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next
      .handle()
      .pipe(
        tap(() => {
          const responseTime = Date.now() - start;
          
          // Record the request stats for analytics
          const requestStat = {
            timestamp: Date.now(),
            method: request.method,
            url: request.url,
            responseTime,
            statusCode: response.statusCode,
          };
          
          // Add to static storage (in production, this would be in a cache or DB)
          RequestMetricsInterceptor.requestStats.push(requestStat);
          
          // Keep only the last 1000 requests to avoid memory issues
          if (RequestMetricsInterceptor.requestStats.length > 1000) {
            RequestMetricsInterceptor.requestStats = 
              RequestMetricsInterceptor.requestStats.slice(-1000);
          }
        })
      );
  }
  
  // Static method to access request stats from the service
  static getRequestStats() {
    return [...RequestMetricsInterceptor.requestStats]; // Return a copy
  }
  
  static clearOldStats() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour in milliseconds
    RequestMetricsInterceptor.requestStats = 
      RequestMetricsInterceptor.requestStats.filter(stat => stat.timestamp > oneHourAgo);
  }
}