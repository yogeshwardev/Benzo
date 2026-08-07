import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Admin
  const adminPassword = await argon2.hash('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillforge.com' },
    update: {},
    create: {
      email: 'admin@skillforge.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  // Create Instructor
  const instructorPassword = await argon2.hash('instructor123')
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@skillforge.com' },
    update: {},
    create: {
      email: 'instructor@skillforge.com',
      name: 'John Instructor',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  // Create Student
  const studentPassword = await argon2.hash('student123')
  const student = await prisma.user.upsert({
    where: { email: 'student@skillforge.com' },
    update: {},
    create: {
      email: 'student@skillforge.com',
      name: 'Jane Student',
      password: studentPassword,
      role: 'STUDENT',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  // Create wallets
  await prisma.wallet.upsert({
    where: { userId: student.id },
    update: {},
    create: { userId: student.id, balance: 0 },
  })

  // Create referral codes
  await prisma.referralCode.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      code: 'STUDENT01',
    },
  })

  // Create Courses
  const courses = [
    {
      title: 'C Programming Masterclass',
      description: 'Learn C programming from scratch with hands-on projects and real-world examples.',
      thumbnail: '/courses/c-programming.jpg',
      price: 699,
      category: 'Programming',
      difficulty: 'BEGINNER',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'Python for Data Science',
      description: 'Master Python programming and data science libraries like Pandas, NumPy, and more.',
      thumbnail: '/courses/python.jpg',
      price: 699,
      category: 'Data Science',
      difficulty: 'INTERMEDIATE',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'Web Development with AI',
      description: 'Build modern web applications using AI tools and technologies.',
      thumbnail: '/courses/web-dev-ai.jpg',
      price: 699,
      category: 'Web Development',
      difficulty: 'INTERMEDIATE',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'DevOps Fundamentals',
      description: 'Learn Docker, Kubernetes, CI/CD, and cloud deployment strategies.',
      thumbnail: '/courses/devops.jpg',
      price: 699,
      category: 'DevOps',
      difficulty: 'ADVANCED',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'Java Programming',
      description: 'Master Java programming from basics to advanced concepts.',
      thumbnail: '/courses/java.jpg',
      price: 699,
      category: 'Programming',
      difficulty: 'BEGINNER',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'C++ for Game Development',
      description: 'Learn C++ programming for game development and system programming.',
      thumbnail: '/courses/cpp.jpg',
      price: 699,
      category: 'Programming',
      difficulty: 'INTERMEDIATE',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
    {
      title: 'Linux Administration',
      description: 'Master Linux system administration and command-line operations.',
      thumbnail: '/courses/linux.jpg',
      price: 699,
      category: 'DevOps',
      difficulty: 'INTERMEDIATE',
      language: 'English',
      instructorId: instructor.id,
      isPublished: true,
    },
  ]

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: {
        id: courseData.title.toLowerCase().replace(/\s+/g, '-'),
      },
      update: {},
      create: {
        ...(courseData as any),
        id: courseData.title.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    // Create modules for each course
    const moduleCount = Math.floor(Math.random() * 5) + 3
    for (let i = 1; i <= moduleCount; i++) {
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: `Module ${i}: ${getModuleTitle(i)}`,
          description: `Learn the fundamentals of ${getModuleTitle(i).toLowerCase()}`,
          order: i,
        },
      })

      // Create lessons for each module
      const lessonCount = Math.floor(Math.random() * 5) + 3
      for (let j = 1; j <= lessonCount; j++) {
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            courseId: course.id,
            title: `Lesson ${j}: ${getLessonTitle(j)}`,
            description: `Learn about ${getLessonTitle(j).toLowerCase()}`,
            videoUrl: `https://example.com/videos/${course.id}/${module.id}/${j}.mp4`,
            videoDuration: Math.floor(Math.random() * 3600) + 600,
            order: j,
            isPreview: j === 1,
          },
        })
      }
    }

    // Update course totals
    const totalModules = await prisma.module.count({ where: { courseId: course.id } })
    const totalLessons = await prisma.lesson.count({ where: { courseId: course.id } })
    const totalDuration = await prisma.lesson.aggregate({
      where: { courseId: course.id },
      _sum: { videoDuration: true },
    })

    await prisma.course.update({
      where: { id: course.id },
      data: {
        totalModules,
        totalLessons,
        totalDuration: totalDuration._sum.videoDuration || 0,
      },
    })
  }

  // Create Coupons
  const coupons = [
    {
      code: 'WELCOME100',
      discountType: 'FLAT',
      discountValue: 100,
      maxDiscount: 100,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      createdBy: admin.id,
    },
    {
      code: 'NEWSTUDENT',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxDiscount: 200,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      createdBy: admin.id,
    },
    {
      code: 'AI2026',
      discountType: 'PERCENTAGE',
      discountValue: 30,
      maxDiscount: 300,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: 200,
      minPurchase: 1000,
      createdBy: admin.id,
    },
  ]

  for (const couponData of coupons) {
    await prisma.coupon.upsert({
      where: { code: couponData.code },
      update: {},
      create: couponData as any,
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log('\n📝 Test Accounts:')
  console.log('Admin: admin@skillforge.com / admin123')
  console.log('Instructor: instructor@skillforge.com / instructor123')
  console.log('Student: student@skillforge.com / student123')
}

function getModuleTitle(index: number): string {
  const titles = [
    'Introduction',
    'Fundamentals',
    'Advanced Concepts',
    'Practical Applications',
    'Best Practices',
    'Real-world Projects',
  ]
  return titles[index - 1] || 'Additional Topics'
}

function getLessonTitle(index: number): string {
  const titles = [
    'Getting Started',
    'Core Concepts',
    'Deep Dive',
    'Hands-on Practice',
    'Advanced Techniques',
  ]
  return titles[index - 1] || 'Bonus Content'
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
