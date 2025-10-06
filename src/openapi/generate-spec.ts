import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Medicine Assistant')
    .setDescription('API documentation')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outDir = join(process.cwd(), 'docs');
  if (!existsSync(outDir)) mkdirSync(outDir);
  writeFileSync(join(outDir, 'openapi.json'), JSON.stringify(document, null, 2));
  await app.close();
}

generate().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
