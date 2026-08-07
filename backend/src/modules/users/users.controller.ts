import { Controller, Get, Put, Delete, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Delete('profile')
  async deleteAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: string,
  ) {
    return this.usersService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      role,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
