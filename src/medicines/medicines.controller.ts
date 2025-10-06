import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { CreateProspectusDto } from './dto/create-prospectus.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('medicines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly meds: MedicinesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateMedicineDto) {
    return this.meds.create(user.userId, dto);
  }

  @Get()
  list() {
    return this.meds.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.meds.get(id);
  }

  @Post('prospectus')
  addProspectus(@CurrentUser() user: any, @Body() dto: CreateProspectusDto) {
    return this.meds.addProspectus(user.userId, dto);
  }

  @Get(':id/prospectus')
  listProspectus(@Param('id') id: string) {
    return this.meds.listProspectus(id);
  }
}
