import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergen } from '../entities/allergen';
import { AllergensService } from './allergens.service';
import { AllergensController } from './allergens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Allergen])],
  providers: [AllergensService],
  controllers: [AllergensController],
  exports: [AllergensService],
})
export class AllergensModule {}
