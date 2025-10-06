import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from '../entities/timer';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Timer])],
  providers: [TimersService],
  controllers: [TimersController],
  exports: [TimersService],
})
export class TimersModule {}
