import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';
import { UserRole, LiveClassStatus } from '@skillforge/shared';

@Injectable()
export class LiveClassesService {
  private livekitClient: RoomServiceClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const livekitUrl = this.configService.get('LIVEKIT_URL') || 'http://localhost:7880';
    const apiKey = this.configService.get('LIVEKIT_API_KEY') || 'devkey';
    const apiSecret = this.configService.get('LIVEKIT_API_SECRET') || 'secret';
    this.livekitClient = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
  }

  async createLiveClass(courseId: string, userId: string, data: any) {
    // Check if user owns the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only create live classes for your own courses');
    }

    // Generate unique room name
    const roomName = `course-${courseId}-${Date.now()}`;

    const liveClass = await this.prisma.liveClass.create({
      data: {
        ...data,
        courseId,
        instructorId: userId,
        roomName,
        status: LiveClassStatus.SCHEDULED,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return liveClass;
  }

  async getLiveClasses(courseId: string, userId: string) {
    // Check if user is enrolled or is instructor
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!isEnrolled && course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view live classes');
    }

    const liveClasses = await this.prisma.liveClass.findMany({
      where: { courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            attendance: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return liveClasses;
  }

  async getLiveClassById(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    // Check if user is enrolled or is instructor
    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: liveClass.courseId,
        },
      },
    });

    if (!isEnrolled && liveClass.course.instructorId !== userId) {
      throw new ForbiddenException('You must be enrolled to view this live class');
    }

    return liveClass;
  }

  async updateLiveClass(liveClassId: string, userId: string, data: any) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    if (liveClass.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own live classes');
    }

    const updatedLiveClass = await this.prisma.liveClass.update({
      where: { id: liveClassId },
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return updatedLiveClass;
  }

  async deleteLiveClass(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    if (liveClass.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own live classes');
    }

    await this.prisma.liveClass.delete({
      where: { id: liveClassId },
    });

    return { message: 'Live class deleted successfully' };
  }

  async startLiveClass(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    if (liveClass.instructorId !== userId) {
      throw new ForbiddenException('You can only start your own live classes');
    }

    if (liveClass.status !== LiveClassStatus.SCHEDULED) {
      throw new BadRequestException('Live class has already started or ended');
    }

    // Create LiveKit room
    await this.livekitClient.createRoom({
      name: liveClass.roomName,
      emptyTimeout: 10 * 60, // 10 minutes
    });

    const updatedLiveClass = await this.prisma.liveClass.update({
      where: { id: liveClassId },
      data: { status: LiveClassStatus.LIVE },
    });

    return updatedLiveClass;
  }

  async endLiveClass(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    if (liveClass.instructorId !== userId) {
      throw new ForbiddenException('You can only end your own live classes');
    }

    if (liveClass.status !== LiveClassStatus.LIVE) {
      throw new BadRequestException('Live class is not currently live');
    }

    // Delete LiveKit room
    await this.livekitClient.deleteRoom(liveClass.roomName);

    const updatedLiveClass = await this.prisma.liveClass.update({
      where: { id: liveClassId },
      data: { status: LiveClassStatus.ENDED },
    });

    return updatedLiveClass;
  }

  async joinLiveClass(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
      include: {
        course: true,
      },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: liveClass.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to join this live class');
    }

    if (liveClass.status !== LiveClassStatus.LIVE) {
      throw new BadRequestException('Live class is not currently live');
    }

    // Generate LiveKit token
    const token = new AccessToken(
      this.configService.get('LIVEKIT_API_KEY'),
      this.configService.get('LIVEKIT_API_SECRET'),
      {
        identity: userId,
        name: `User-${userId}`,
      },
    );

    token.addGrant({
      room: liveClass.roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const accessToken = token.toJwt();

    // Record attendance
    await this.prisma.liveClassAttendance.create({
      data: {
        liveClassId,
        userId,
        joinedAt: new Date(),
      },
    });

    return {
      accessToken,
      roomName: liveClass.roomName,
      liveClassId: liveClass.id,
    };
  }

  async leaveLiveClass(liveClassId: string, userId: string) {
    const attendance = await this.prisma.liveClassAttendance.findFirst({
      where: {
        liveClassId,
        userId,
        leftAt: null,
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    const duration = Math.floor((Date.now() - attendance.joinedAt.getTime()) / 1000);

    await this.prisma.liveClassAttendance.update({
      where: { id: attendance.id },
      data: {
        leftAt: new Date(),
        duration,
      },
    });

    return { message: 'Left live class successfully' };
  }

  async getLiveClassAttendance(liveClassId: string, userId: string) {
    const liveClass = await this.prisma.liveClass.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    if (liveClass.instructorId !== userId) {
      throw new ForbiddenException('Only instructors can view attendance');
    }

    const attendance = await this.prisma.liveClassAttendance.findMany({
      where: { liveClassId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return attendance;
  }

  async getUpcomingLiveClasses(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    const liveClasses = await this.prisma.liveClass.findMany({
      where: {
        courseId: { in: courseIds },
        scheduledAt: { gte: new Date() },
        status: LiveClassStatus.SCHEDULED,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    });

    return liveClasses;
  }

  async getInstructorLiveClasses(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [liveClasses, total] = await Promise.all([
      this.prisma.liveClass.findMany({
        where: { instructorId: userId },
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          _count: {
            select: {
              attendance: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.liveClass.count({ where: { instructorId: userId } }),
    ]);

    return {
      data: liveClasses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
