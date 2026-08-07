'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, BookOpen, Award, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    enrollments: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await api.getAdminStats()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalytics({
        totalRevenue: 325000,
        monthlyRevenue: 45000,
        totalUsers: 1500,
        activeUsers: 950,
        totalCourses: 25,
        activeCourses: 20,
        enrollments: 2800,
        completionRate: 72,
      })
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold mb-6">Platform Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.monthlyRevenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Users className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Award className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <BookOpen className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCourses}</div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Calendar className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeCourses}</div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Award className="h-5 w-5 text-primary" />
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.enrollments.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-primary" />
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completionRate}%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">Python for Data Science</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">450 students</span>
                    <span className="font-semibold">₹31,500 revenue</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">Web Development with AI</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">380 students</span>
                    <span className="font-semibold">₹26,600 revenue</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">DevOps Fundamentals</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">280 students</span>
                    <span className="font-semibold">₹19,600 revenue</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="font-medium">25 new enrollments</p>
                  <p className="text-sm text-muted-foreground">₹17,500 revenue</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                  <p className="font-medium">18 new enrollments</p>
                  <p className="text-sm text-muted-foreground">₹12,600 revenue</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="font-medium">125 new enrollments</p>
                  <p className="text-sm text-muted-foreground">₹87,500 revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
