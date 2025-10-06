import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TimersService } from './timers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateTimerDto } from './dto/create-timer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('timers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('timers')
export class TimersController {
  constructor(private readonly timers: TimersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateTimerDto) {
    return this.timers.create(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: any) {
    return this.timers.list(user.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: any, @Param('id') id: string) {
    return this.timers.get(user.userId, id);
  }
}
