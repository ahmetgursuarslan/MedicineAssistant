import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersService } from '../../users/users.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Get all users (admin only)' })
  async getAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Get system statistics (admin only)' })
  async getSystemStats() {
    // In a real implementation, this would return system statistics
    return {
      totalUsers: await this.usersService.countUsers(),
      timestamp: new Date().toISOString(),
    };
  }
}