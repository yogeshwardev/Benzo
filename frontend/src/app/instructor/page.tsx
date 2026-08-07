'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, TrendingUp, DollarSign, Calendar, Video, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeClasses: 0,
    pendingReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getInstructorStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Use mock data if API fails
      setStats({
        totalCourses: 5,
        totalStudents: 1250,
        totalRevenue: 87500,
        averageRating: 4.8,
        activeClasses: 3,
        pendingReviews: 12,
      })
    } finally {
      setLoading(false)
    }
  }

  const myCourses = [
    {
      id: '1',
      title: 'Python for Data Science',
      students: 450,
      revenue: 31500,
      rating: 4.9,
      status: 'Published',
    },
    {
      id: '2',
      title: 'Web Development with AI',
      students: 380,
      revenue: 26600,
      rating: 4.7,
      status: 'Published',
    },
    {
      id: '3',
      title: 'Advanced Machine Learning',
      students: 420,
      revenue: 29400,
      rating: 4.8,
      status: 'Draft',
    },
  ]

  const upcomingClasses = [
    {
      id: '1',
      title: 'Live Q&A Session',
      course: 'Python for Data Science',
      date: 'Today',
      time: '3:00 PM',
      enrolled: 45,
    },
    {
      id: '2',
      title: 'Project Review',
      course: 'Web Development with AI',
      date: 'Tomorrow',
      time: '5:00 PM',
      enrolled: 32,
    },
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'enrollment',
      message: 'John Doe enrolled in Python for Data Science',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'review',
      message: 'New 5-star review on Web Development with AI',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'assignment',
      message: '15 new assignment submissions to review',
      time: '1 day ago',
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track your performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button asChild>
              <Link href="/instructor/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses, color: 'text-blue-500' },
            { icon: Users, label: 'Total Students', value: stats.totalStudents.toLocaleString(), color: 'text-green-500' },
            { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'text-yellow-500' },
            { icon: TrendingUp, label: 'Average Rating', value: stats.averageRating, color: 'text-purple-500' },
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
          {/* My Courses */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      My Courses
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/instructor/courses">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{course.students} students</span>
                            <span>₹{course.revenue.toLocaleString()} revenue</span>
                            <span className="flex items-center">
                              ⭐ {course.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              course.status === 'Published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {course.status}
                          </span>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/instructor/courses/${course.id}`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        <span>{classItem.date} at {classItem.time}</span>
                        <span>{classItem.enrolled} enrolled</span>
                      </div>
                      <Button size="sm" className="w-full">
                        Start Class
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/instructor/live-classes">Schedule New Class</Link>
                  </Button>
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
                    <Link href="/instructor/courses/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/instructor/assignments">
                      <Video className="mr-2 h-4 w-4" />
                      Review Assignments
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/instructor/analytics">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/instructor/announcements">
                      <Settings className="mr-2 h-4 w-4" />
                      Announcements
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
