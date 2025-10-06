import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AllergensService } from './allergens.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateAllergenDto } from './dto/create-allergen.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('allergens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('allergens')
export class AllergensController {
  constructor(private readonly allergens: AllergensService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateAllergenDto) {
    return this.allergens.create(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: any) {
    return this.allergens.findAll(user.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: any, @Param('id') id: string) {
    return this.allergens.findOne(user.userId, id);
  }
}
