import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { PgExceptionFilter } from './common/filters/pg-exception.filter';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { LoggerService } from '@nestjs/common';

async function bootstrap() {
  const pinoBase = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
  });
  const nestLogger: LoggerService = {
    log(message: any, context?: string) {
      pinoBase.info({ context }, message);
    },
    error(message: any, trace?: string, context?: string) {
      pinoBase.error({ context, trace }, message);
    },
    warn(message: any, context?: string) {
      pinoBase.warn({ context }, message);
    },
    debug(message: any, context?: string) {
      pinoBase.debug({ context }, message);
    },
    verbose(message: any, context?: string) {
      pinoBase.trace({ context }, message);
    },
  };
  const app = await NestFactory.create(AppModule, { bufferLogs: true, logger: nestLogger });
  app.use(
    pinoHttp({
      logger: pinoBase,
      serializers: {
        req(req) {
          return { id: (req as any).id, method: req.method, url: req.url };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Medicine Assistant')
    .setDescription('API documentation for Medicine Assistant backend')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalFilters(new PgExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  pinoBase.info(`Server running on http://localhost:${port}`);
}
bootstrap();