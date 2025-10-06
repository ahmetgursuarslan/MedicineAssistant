import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from '../entities/disease';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Disease])],
  providers: [DiseasesService],
  controllers: [DiseasesController],
  exports: [DiseasesService],
})
export class DiseasesModule {}
