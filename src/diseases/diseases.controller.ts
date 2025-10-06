import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('diseases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseases: DiseasesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateDiseaseDto) {
    return this.diseases.create(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: any) {
    return this.diseases.findAll(user.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: any, @Param('id') id: string) {
    return this.diseases.findOne(user.userId, id);
  }
}
