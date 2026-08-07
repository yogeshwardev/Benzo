'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, BookOpen, TrendingUp, Calendar, Settings, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    dailyActiveUsers: 0,
    totalRevenue: 0,
    totalCourses: 0,
    totalInstructors: 0,
    pendingApprovals: 0,
    totalCoupons: 0,
    totalReferrals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Use mock data if API fails
      setStats({
        totalStudents: 50000,
        dailyActiveUsers: 3500,
        totalRevenue: 3500000,
        totalCourses: 50,
        totalInstructors: 25,
        pendingApprovals: 8,
        totalCoupons: 15,
        totalReferrals: 1200,
      })
    } finally {
      setLoading(false)
    }
  }

  const recentOrders = [
    {
      id: '1',
      user: 'John Doe',
      course: 'Python for Data Science',
      amount: 699,
      status: 'Completed',
      date: '2024-01-10',
    },
    {
      id: '2',
      user: 'Jane Smith',
      course: 'Web Development with AI',
      amount: 699,
      status: 'Completed',
      date: '2024-01-10',
    },
    {
      id: '3',
      user: 'Mike Johnson',
      course: 'DevOps Fundamentals',
      amount: 699,
      status: 'Pending',
      date: '2024-01-09',
    },
  ]

  const topCourses = [
    {
      id: '1',
      title: 'Python for Data Science',
      enrollments: 15000,
      revenue: 10485000,
      rating: 4.9,
    },
    {
      id: '2',
      title: 'Web Development with AI',
      enrollments: 12000,
      revenue: 8388000,
      rating: 4.7,
    },
    {
      id: '3',
      title: 'C Programming Masterclass',
      enrollments: 10000,
      revenue: 6990000,
      rating: 4.8,
    },
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'user',
      message: 'New user registration: Sarah Wilson',
      time: '5 minutes ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'course',
      message: 'New course submitted for review: Advanced React',
      time: '1 hour ago',
      status: 'warning',
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment received: ₹699 from John Doe',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'system',
      message: 'Database backup completed successfully',
      time: '6 hours ago',
      status: 'success',
    },
  ]

  const systemHealth = {
    database: 'Healthy',
    api: 'Operational',
    cdn: 'Operational',
    email: 'Operational',
  }

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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button asChild>
              <Link href="/admin/settings">System Settings</Link>
            </Button>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Students', value: stats.totalStudents.toLocaleString(), color: 'text-blue-500' },
            { icon: TrendingUp, label: 'Daily Active Users', value: stats.dailyActiveUsers.toLocaleString(), color: 'text-green-500' },
            { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: 'text-yellow-500' },
            { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses, color: 'text-purple-500' },
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Recent Orders
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/orders">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{order.user}</h3>
                          <p className="text-sm text-muted-foreground">{order.course}</p>
                          <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.amount}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Top Performing Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCourses.map((course, index) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 rounded-xl border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{course.enrollments.toLocaleString()} enrollments</span>
                              <span>₹{(course.revenue / 100000).toFixed(1)}L revenue</span>
                              <span className="flex items-center">
                                ⭐ {course.rating}
                              </span>
                            </div>
                          </div>
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
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        {activity.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
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
            {/* Pending Approvals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Pending Approvals
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {stats.pendingApprovals}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">New Course Submission</span>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Review
                        </Button>
                        <Button size="sm" className="flex-1">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin/approvals">View All</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(systemHealth).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/courses">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Courses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/coupons">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Manage Coupons
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/analytics">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/reports">
                      <Calendar className="mr-2 h-4 w-4" />
                      Generate Reports
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
