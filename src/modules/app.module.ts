import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../providers/app.service';
import { typePostegreSqlOrmConfig } from '../db/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forRoot(typePostegreSqlOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}