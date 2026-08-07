import { Controller, Get, Post, Delete, UseGuards, Request, Query, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, NotificationType } from '@skillforge/shared';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.notificationsService.getNotifications(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Post(':id/mark-read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    return this.notificationsService.deleteNotification(id, req.user.id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendBulkNotification(@Request() req, @Body() body: { userIds: string[]; type: NotificationType; title: string; message: string; actionUrl?: string }) {
    return this.notificationsService.sendBulkNotification(body.userIds, body);
  }

  @Post('assignment/:assignmentId/reminder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async sendAssignmentReminder(@Param('assignmentId') assignmentId: string) {
    return this.notificationsService.sendAssignmentReminder(assignmentId);
  }

  @Post('live-class/:liveClassId/reminder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async sendLiveClassReminder(@Param('liveClassId') liveClassId: string) {
    return this.notificationsService.sendLiveClassReminder(liveClassId);
  }
}
