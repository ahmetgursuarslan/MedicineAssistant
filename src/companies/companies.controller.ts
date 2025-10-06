import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCompanyDto) {
    return this.companies.create(user.userId, dto);
  }

  @Get()
  list() {
    return this.companies.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.companies.findOne(id);
  }
}
