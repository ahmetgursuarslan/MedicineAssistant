import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('reminders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly reminders: RemindersService) {}

  @Get('timer/:timerId')
  list(@Param('timerId') timerId: string) {
    return this.reminders.list(timerId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.reminders.get(Number(id));
  }
}
