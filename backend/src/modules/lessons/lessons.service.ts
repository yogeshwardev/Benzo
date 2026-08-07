import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@skillforge/shared';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class LessonsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private certificatesService: CertificatesService,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
      },
      region: 'auto',
    });
    this.bucketName = this.configService.get('R2_BUCKET_NAME');
  }

  async createLesson(moduleId: string, userId: string, data: any, videoFile?: Express.Multer.File) {
    // Check if user owns the module
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only add lessons to your own modules');
    }

    // Upload video if provided
    let videoUrl = data.videoUrl;
    if (videoFile) {
      videoUrl = await this.uploadVideo(videoFile);
    }

    // Get the next order number
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: 'desc' },
    });

    const order = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await this.prisma.lesson.create({
      data: {
        ...data,
        moduleId,
        courseId: module.courseId,
        videoUrl,
        order,
      },
      include: {
        resources: true,
      },
    });

    // Update course total lessons and duration
    await this.prisma.course.update({
      where: { id: module.courseId },
      data: {
        totalLessons: {
          increment: 1,
        },
        totalDuration: {
          increment: data.videoDuration || 0,
        },
      },
    });

    return lesson;
  }

  async getLessonById(lessonId: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                instructorId: true,
              },
            },
          },
        },
        resources: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if user is enrolled
    let isEnrolled = false;
    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.courseId,
          },
        },
      });
      isEnrolled = !!enrollment;
    }

    // Hide video if not enrolled and not preview
    if (!isEnrolled && !lesson.isPreview) {
      lesson.videoUrl = null;
    }

    return lesson;
  }

  async updateLesson(lessonId: string, userId: string, data: any, videoFile?: Express.Multer.File) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own lessons');
    }

    // Upload new video if provided
    if (videoFile) {
      // Delete old video
      if (lesson.videoUrl) {
        await this.deleteVideo(lesson.videoUrl);
      }
      data.videoUrl = await this.uploadVideo(videoFile);
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data,
      include: {
        resources: true,
      },
    });

    return updatedLesson;
  }

  async deleteLesson(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own lessons');
    }

    // Delete video
    if (lesson.videoUrl) {
      await this.deleteVideo(lesson.videoUrl);
    }

    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Update course total lessons and duration
    await this.prisma.course.update({
      where: { id: lesson.courseId },
      data: {
        totalLessons: {
          decrement: 1,
        },
        totalDuration: {
          decrement: lesson.videoDuration,
        },
      },
    });

    return { message: 'Lesson deleted successfully' };
  }

  async addResource(lessonId: string, userId: string, data: any, file?: Express.Multer.File) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only add resources to your own lessons');
    }

    let url = data.url;
    if (file) {
      url = await this.uploadFile(file);
    }

    const resource = await this.prisma.lessonResource.create({
      data: {
        lessonId,
        title: data.title,
        type: data.type,
        url,
        size: file?.size || 0,
      },
    });

    return resource;
  }

  async deleteResource(resourceId: string, userId: string) {
    const resource = await this.prisma.lessonResource.findUnique({
      where: { id: resourceId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.lesson.module.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own resources');
    }

    // Delete file
    await this.deleteFile(resource.url);

    await this.prisma.lessonResource.delete({
      where: { id: resourceId },
    });

    return { message: 'Resource deleted successfully' };
  }

  async updateProgress(lessonId: string, userId: string, data: any) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to track progress');
    }

    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        ...data,
        completedAt: data.completed ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        ...data,
        completedAt: data.completed ? new Date() : null,
      },
    });

    // Update enrollment progress
    await this.updateEnrollmentProgress(userId, lesson.courseId);

    return progress;
  }

  private async uploadVideo(file: Express.Multer.File): Promise<string> {
    const key = `videos/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${this.configService.get('R2_ENDPOINT')}/${this.bucketName}/${key}`;
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `resources/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${this.configService.get('R2_ENDPOINT')}/${this.bucketName}/${key}`;
  }

  private async deleteVideo(url: string): Promise<void> {
    const key = url.split('/').pop();
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `videos/${key}`,
    });

    await this.s3Client.send(command);
  }

  private async deleteFile(url: string): Promise<void> {
    const key = url.split('/').pop();
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `resources/${key}`,
    });

    await this.s3Client.send(command);
  }

  private async updateEnrollmentProgress(userId: string, courseId: string) {
    // Get all lessons in the course
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
    });

    // Get completed lessons
    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: lessons.map((l) => l.id) },
        completed: true,
      },
    });

    const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

    await this.prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: { progress },
    });

    // Check if course is completed
    if (progress === 100) {
      const updatedEnrollment = await this.prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: { completedAt: new Date() },
      });

      // Generate certificate if not already exists
      const existingCertificate = await this.prisma.certificate.findUnique({
        where: { enrollmentId: updatedEnrollment.id },
      });

      if (!existingCertificate) {
        await this.certificatesService.generateCertificate(userId, courseId, updatedEnrollment.id);
      }
    }
  }
}
