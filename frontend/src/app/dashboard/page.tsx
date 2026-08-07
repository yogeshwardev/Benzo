'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Award, TrendingUp, Calendar, Wallet, Users, Bell } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgress: 0,
    totalHours: 0,
    certificates: 0,
    walletBalance: 0,
    upcomingClasses: 0,
    referrals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const enrollments = await api.getMyEnrollments()
      const wallet = await api.getWalletBalance()
      const referrals = await api.getReferralStats()
      
      setStats({
        enrolledCourses: enrollments.length,
        completedCourses: enrollments.filter((e: any) => e.completed).length,
        inProgress: enrollments.filter((e: any) => !e.completed).length,
        totalHours: enrollments.reduce((acc: number, e: any) => acc + e.hours, 0),
        certificates: enrollments.filter((e: any) => e.completed).length,
        walletBalance: wallet.balance,
        upcomingClasses: 0, // Would come from live classes API
        referrals: referrals.total,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Use mock data if API fails
      setStats({
        enrolledCourses: 3,
        completedCourses: 1,
        inProgress: 2,
        totalHours: 24,
        certificates: 1,
        walletBalance: 200,
        upcomingClasses: 2,
        referrals: 5,
      })
    } finally {
      setLoading(false)
    }
  }

  const continueLearning = [
    {
      id: '1',
      title: 'Python for Data Science',
      progress: 65,
      lastLesson: 'Data Visualization with Matplotlib',
      thumbnail: '/courses/python.jpg',
      instructor: 'Jane Smith',
    },
    {
      id: '2',
      title: 'Web Development with AI',
      progress: 35,
      lastLesson: 'Introduction to AI Tools',
      thumbnail: '/courses/web-dev-ai.jpg',
      instructor: 'Mike Johnson',
    },
  ]

  const upcomingClasses = [
    {
      id: '1',
      title: 'Live Q&A Session',
      course: 'Python for Data Science',
      date: 'Today',
      time: '3:00 PM',
      instructor: 'Jane Smith',
    },
    {
      id: '2',
      title: 'Project Review',
      course: 'Web Development with AI',
      date: 'Tomorrow',
      time: '5:00 PM',
      instructor: 'Mike Johnson',
    },
  ]

  const recentAssignments = [
    {
      id: '1',
      title: 'Data Analysis Project',
      course: 'Python for Data Science',
      dueDate: '2024-01-15',
      status: 'Pending',
    },
    {
      id: '2',
      title: 'Build a Simple App',
      course: 'Web Development with AI',
      dueDate: '2024-01-20',
      status: 'In Progress',
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: stats.enrolledCourses, color: 'text-blue-500' },
            { icon: Clock, label: 'Learning Hours', value: stats.totalHours, color: 'text-green-500' },
            { icon: Award, label: 'Certificates', value: stats.certificates, color: 'text-yellow-500' },
            { icon: Wallet, label: 'Wallet Balance', value: `₹${stats.walletBalance}`, color: 'text-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {continueLearning.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="block"
                    >
                      <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-8 w-8 text-primary/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button size="sm">Continue</Button>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Assignments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 rounded-xl border"
                      >
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assignment.course}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {assignment.dueDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              assignment.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/assignments">View All Assignments</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="p-4 rounded-xl border space-y-2"
                    >
                      <h3 className="font-semibold">{classItem.title}</h3>
                      <p className="text-sm text-muted-foreground">{classItem.course}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>{classItem.date}</span>
                        <span>{classItem.time}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        Join Class
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/courses">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Courses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/certificates">
                      <Award className="mr-2 h-4 w-4" />
                      Certificates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/wallet">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/referrals">
                      <Users className="mr-2 h-4 w-4" />
                      Referrals
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
