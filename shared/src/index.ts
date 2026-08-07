// User Types
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum LiveClassStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum DiscountType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE'
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum ReferenceType {
  REFERRAL = 'REFERRAL',
  ADMIN = 'ADMIN',
  REFUND = 'REFUND'
}

export enum ReferralStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export enum NotificationType {
  ASSIGNMENT = 'ASSIGNMENT',
  LIVE_CLASS = 'LIVE_CLASS',
  PAYMENT = 'PAYMENT',
  COURSE_COMPLETION = 'COURSE_COMPLETION',
  GENERAL = 'GENERAL'
}

export enum QuestionType {
  MCQ = 'MCQ',
  CODING = 'CODING'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  education?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  difficulty: Difficulty;
  language: string;
  instructorId: string;
  instructor?: User;
  isPublished: boolean;
  totalModules: number;
  totalLessons: number;
  totalDuration: number;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  order: number;
  isPreview: boolean;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  type: 'PDF' | 'ZIP' | 'IMAGE';
  url: string;
  size: number;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  certificateId?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  watchTime: number;
  lastPosition: number;
  playbackSpeed: number;
  completedAt?: Date;
}

// Assignment Types
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxMarks: number;
  attachments: string[];
  createdAt: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  files: string[];
  submittedAt: Date;
  marks?: number;
  feedback?: string;
  reviewedAt?: Date;
}

// Quiz Types
export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string>;
  marks: number;
  completedAt: Date;
  timeTaken: number;
}

// Live Class Types
export interface LiveClass {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  roomName: string;
  isRecordingEnabled: boolean;
  status: LiveClassStatus;
  recordingUrl?: string;
  attendance: LiveClassAttendance[];
}

export interface LiveClassAttendance {
  id: string;
  liveClassId: string;
  userId: string;
  joinedAt: Date;
  leftAt?: Date;
  duration: number;
}

// Payment Types
export interface Order {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  couponId?: string;
  discountAmount: number;
  walletAmountUsed: number;
  finalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  courseId?: string;
  minPurchase?: number;
  isActive: boolean;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  createdAt: Date;
}

// Referral Types
export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  createdAt: Date;
}

export interface ReferralTransaction {
  id: string;
  referrerId: string;
  refereeId: string;
  refereeEarning: number;
  referrerEarning: number;
  status: ReferralStatus;
  createdAt: Date;
  completedAt?: Date;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateId: string;
  issueDate: Date;
  verificationUrl: string;
  qrCodeUrl: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Analytics Types
export interface Analytics {
  totalStudents: number;
  dailyActiveUsers: number;
  totalRevenue: number;
  totalCourses: number;
  totalInstructors: number;
  topCourses: CourseAnalytics[];
  couponUsage: CouponAnalytics[];
  referralConversions: number;
  assignmentCompletion: number;
  averageAttendance: number;
}

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  enrollments: number;
  revenue: number;
  completionRate: number;
  averageRating: number;
}

export interface CouponAnalytics {
  couponId: string;
  code: string;
  usageCount: number;
  totalDiscount: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
