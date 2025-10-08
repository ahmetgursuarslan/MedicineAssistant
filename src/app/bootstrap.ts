import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { PgExceptionFilter } from '../common/filters/pg-exception.filter';

export function configureApp(app: INestApplication) {
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
  app.useGlobalFilters(new PgExceptionFilter());
}
