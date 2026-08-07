import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@skillforge/shared';
import { ModulesService } from './modules.service';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Post()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async createModule(@Body() body: { courseId: string } & any, @Request() req) {
    return this.modulesService.createModule(body.courseId, req.user.id, body);
  }

  @Get(':id')
  async getModuleById(@Param('id') id: string, @Request() req) {
    return this.modulesService.getModuleById(id, req.user?.id);
  }

  @Put(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async updateModule(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.modulesService.updateModule(id, req.user.id, body);
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async deleteModule(@Param('id') id: string, @Request() req) {
    return this.modulesService.deleteModule(id, req.user.id);
  }

  @Put(':id/reorder')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async reorderModule(@Param('id') id: string, @Request() req, @Body() body: { newOrder: number }) {
    return this.modulesService.reorderModule(id, req.user.id, body.newOrder);
  }
}
