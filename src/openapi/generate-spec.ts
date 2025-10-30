import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocsModule } from './docs.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function generate() {
  // Provide safe defaults for config validation when running spec generation in CI or locally
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5432';
  process.env.DB_NAME = process.env.DB_NAME || 'placeholder';
  process.env.DB_USER = process.env.DB_USER || 'placeholder';
  process.env.DB_PASS = process.env.DB_PASS || 'placeholder';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123456';
  process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
  // eslint-disable-next-line no-console
  console.log('Starting OpenAPI generation...');
  // eslint-disable-next-line no-console
  console.log('Creating Nest application for spec...');
  let app;
  try {
    process.env.GENERATE_OPENAPI = 'true';
    // Use normal Nest application because SwaggerModule requires INestApplication
    app = await NestFactory.create(DocsModule);
  } catch (e) {
    console.error('Failed during NestFactory.createApplicationContext:', e);
    throw e;
  }
  // eslint-disable-next-line no-console
  console.log('Nest application created, building swagger doc...');
  const config = new DocumentBuilder()
    .setTitle('Medicine Assistant')
    .setDescription('API documentation')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // eslint-disable-next-line no-console
  console.log('Swagger document built, writing file...');
  const outDir = join(process.cwd(), 'docs');
  if (!existsSync(outDir)) mkdirSync(outDir);
  writeFileSync(join(outDir, 'openapi.json'), JSON.stringify(document, null, 2));
  await app.close();
  // eslint-disable-next-line no-console
  console.log('OpenAPI generation completed.');
}

generate().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
