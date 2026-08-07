import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRole } from '@skillforge/shared';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(userId: string, dateRange?: { startDate: Date; endDate: Date }) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view analytics');
    }

    const startDate = dateRange?.startDate || new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endDate = dateRange?.endDate || new Date();

    // Get total students
    const totalStudents = await this.prisma.user.count({
      where: { role: UserRole.STUDENT },
    });

    // Get daily active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActiveUsers = await this.prisma.user.count({
      where: {
        role: UserRole.STUDENT,
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get total revenue
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);

    // Get total courses
    const totalCourses = await this.prisma.course.count({
      where: { isPublished: true },
    });

    // Get total instructors
    const totalInstructors = await this.prisma.user.count({
      where: { role: UserRole.INSTRUCTOR },
    });

    // Get top courses
    const topCourses = await this.prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { enrollmentCount: 'desc' },
      take: 10,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Get coupon usage
    const couponUsage = await this.prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { usedCount: 'desc' },
      take: 10,
    });

    // Get referral conversions
    const referralConversions = await this.prisma.referralTransaction.count({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get assignment completion rate
    const totalAssignments = await this.prisma.assignment.count();
    const totalSubmissions = await this.prisma.assignmentSubmission.count();
    const assignmentCompletion = totalAssignments > 0 
      ? Math.round((totalSubmissions / totalAssignments) * 100) 
      : 0;

    // Get average attendance
    const liveClasses = await this.prisma.liveClass.findMany({
      where: {
        status: 'ENDED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        _count: {
          select: {
            attendance: true,
          },
        },
      },
    });

    const averageAttendance = liveClasses.length > 0
      ? Math.round(liveClasses.reduce((sum, lc) => sum + lc._count.attendance, 0) / liveClasses.length)
      : 0;

    // Get revenue by month
    const revenueByMonth = await this.getRevenueByMonth(startDate, endDate);

    // Get enrollment trends
    const enrollmentTrends = await this.getEnrollmentTrends(startDate, endDate);

    return {
      totalStudents,
      dailyActiveUsers,
      totalRevenue,
      totalCourses,
      totalInstructors,
      topCourses,
      couponUsage,
      referralConversions,
      assignmentCompletion,
      averageAttendance,
      revenueByMonth,
      enrollmentTrends,
    };
  }

  async getCourseAnalytics(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only view analytics for your own courses');
    }

    // Get enrollment stats
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
    });

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completedAt).length;
    const averageProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

    // Get lesson completion stats
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
    });

    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        lessonId: { in: lessons.map((l) => l.id) },
      },
    });

    const totalLessonCompletions = lessonProgress.filter((lp) => lp.completed).length;

    // Get assignment stats
    const assignments = await this.prisma.assignment.findMany({
      where: { courseId },
    });

    const assignmentSubmissions = await this.prisma.assignmentSubmission.findMany({
      where: {
        assignmentId: { in: assignments.map((a) => a.id) },
      },
    });

    const averageAssignmentScore = assignmentSubmissions.length > 0
      ? Math.round(assignmentSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / assignmentSubmissions.length)
      : 0;

    // Get quiz stats
    const quizzes = await this.prisma.quiz.findMany({
      where: { courseId },
    });

    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId: { in: quizzes.map((q) => q.id) },
      },
    });

    const averageQuizScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.marks, 0) / quizAttempts.length)
      : 0;

    return {
      totalEnrollments,
      completedEnrollments,
      averageProgress,
      totalLessons: lessons.length,
      totalLessonCompletions,
      totalAssignments: assignments.length,
      totalAssignmentSubmissions: assignmentSubmissions.length,
      averageAssignmentScore,
      totalQuizzes: quizzes.length,
      totalQuizAttempts: quizAttempts.length,
      averageQuizScore,
    };
  }

  async getStudentAnalytics(userId: string) {
    // Get enrollments
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.completedAt).length;
    const averageProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

    // Get assignment submissions
    const assignmentSubmissions = await this.prisma.assignmentSubmission.findMany({
      where: { userId },
    });

    const averageAssignmentScore = assignmentSubmissions.length > 0
      ? Math.round(assignmentSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / assignmentSubmissions.length)
      : 0;

    // Get quiz attempts
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
    });

    const averageQuizScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.marks, 0) / quizAttempts.length)
      : 0;

    // Get live class attendance
    const liveClassAttendance = await this.prisma.liveClassAttendance.findMany({
      where: { userId },
    });

    const totalLiveClassAttendance = liveClassAttendance.length;
    const averageAttendanceDuration = liveClassAttendance.length > 0
      ? Math.round(liveClassAttendance.reduce((sum, a) => sum + a.duration, 0) / liveClassAttendance.length)
      : 0;

    return {
      totalEnrollments,
      completedCourses,
      averageProgress,
      totalAssignmentSubmissions: assignmentSubmissions.length,
      averageAssignmentScore,
      totalQuizAttempts: quizAttempts.length,
      averageQuizScore,
      totalLiveClassAttendance,
      averageAttendanceDuration,
    };
  }

  private async getRevenueByMonth(startDate: Date, endDate: Date) {
    const months = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      const orders = await this.prisma.order.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const revenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);

      months.push({
        month: current.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  private async getEnrollmentTrends(startDate: Date, endDate: Date) {
    const weeks = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          enrolledAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });

      weeks.push({
        week: weekStart.toLocaleDateString(),
        enrollments: enrollments.length,
      });

      current.setDate(current.getDate() + 7);
    }

    return weeks;
  }
}
