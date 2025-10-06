import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RiskService } from './risk.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines')
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Get(':id/check-user-risk')
  analyze(@CurrentUser() user: any, @Param('id') id: string) {
    return this.risk.analyze(user.userId, id);
  }
}
