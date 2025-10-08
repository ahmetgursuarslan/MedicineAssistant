import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { configureApp } from './app/bootstrap';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { LoggerService } from '@nestjs/common';

async function bootstrap() {
  // Safe pretty logger fallback: only enable if not production AND pino-pretty is installed
  let transport: any = undefined;
  if (process.env.NODE_ENV !== 'production') {
    try {
      require.resolve('pino-pretty');
      transport = { target: 'pino-pretty' };
    } catch {
      // pino-pretty not installed; continue without pretty transport
    }
  }
  const pinoBase = pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(transport ? { transport } : {}),
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

  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Medicine Assistant')
    .setDescription('API documentation for Medicine Assistant backend')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  pinoBase.info(`Server running on http://localhost:${port}`);
}
bootstrap();