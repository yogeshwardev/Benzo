import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { NotificationType } from '@skillforge/shared';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY') || 're_dummy_key_12345');
  }

  async createNotification(userId: string, data: {
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        ...data,
      },
    });

    // Send email notification
    await this.sendEmailNotification(userId, data);

    return notification;
  }

  async getNotifications(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You can only mark your own notifications as read');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updatedNotification;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You can only delete your own notifications');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted successfully' };
  }

  async sendBulkNotification(userIds: string[], data: {
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
  }) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        ...data,
      })),
    });

    // Send email notifications in batches
    for (const userId of userIds) {
      await this.sendEmailNotification(userId, data);
    }

    return { created: notifications.count };
  }

  private async sendEmailNotification(userId: string, data: {
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.configService.get('RESEND_FROM_EMAIL'),
        to: user.email,
        subject: data.title,
        html: `
          <h1>${data.title}</h1>
          <p>${data.message}</p>
          ${data.actionUrl ? `<a href="${data.actionUrl}">Click here to view</a>` : ''}
        `,
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  async sendAssignmentReminder(assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return;
    }

    const userIds = assignment.course.enrollments.map((e) => e.userId);

    await this.sendBulkNotification(userIds, {
      type: NotificationType.ASSIGNMENT,
      title: 'Assignment Reminder',
      message: `Reminder: Assignment "${assignment.title}" is due on ${assignment.dueDate.toLocaleDateString()}`,
      actionUrl: `${this.configService.get('FRONTEND_URL')}/courses/${assignment.courseId}/assignments/${assignmentId}`,
    });
  }

  async sendLiveClassReminder(liveClassId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!liveClass) {
      return;
    }

    const userIds = liveClass.course.enrollments.map((e) => e.userId);

    await this.sendBulkNotification(userIds, {
      type: NotificationType.LIVE_CLASS,
      title: 'Live Class Reminder',
      message: `Reminder: Live class "${liveClass.title}" is scheduled for ${liveClass.scheduledAt.toLocaleString()}`,
      actionUrl: `${this.configService.get('FRONTEND_URL')}/courses/${liveClass.courseId}/live-classes/${liveClassId}`,
    });
  }

  async sendPaymentSuccess(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        course: true,
      },
    });

    if (!order) {
      return;
    }

    await this.createNotification(order.userId, {
      type: NotificationType.PAYMENT,
      title: 'Payment Successful',
      message: `Your payment for "${order.course.title}" was successful. You can now start learning!`,
      actionUrl: `${this.configService.get('FRONTEND_URL')}/courses/${order.courseId}`,
    });
  }

  async sendCourseCompletion(enrollmentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: true,
      },
    });

    if (!enrollment) {
      return;
    }

    await this.createNotification(enrollment.userId, {
      type: NotificationType.COURSE_COMPLETION,
      title: 'Course Completed!',
      message: `Congratulations! You have completed "${enrollment.course.title}". Your certificate is now available.`,
      actionUrl: `${this.configService.get('FRONTEND_URL')}/certificates`,
    });
  }
}
