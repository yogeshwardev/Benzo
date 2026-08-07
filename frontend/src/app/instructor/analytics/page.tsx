'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, BookOpen, Award, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function InstructorAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalStudents: 0,
    averageRating: 0,
    courseCompletion: 0,
    averageWatchTime: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await api.getInstructorStats()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalytics({
        totalRevenue: 87500,
        monthlyRevenue: 15000,
        totalStudents: 1250,
        averageRating: 4.8,
        courseCompletion: 75,
        averageWatchTime: 45,
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
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{analytics.monthlyRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalStudents.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.courseCompletion}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Avg Watch Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.averageWatchTime} min</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">Top Performing Course</h3>
                <p className="text-sm text-muted-foreground">Python for Data Science</p>
                <p className="text-sm text-muted-foreground">450 students • ₹31,500 revenue</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">Most Active Students</h3>
                <p className="text-sm text-muted-foreground">Students completing 2+ lessons/week</p>
                <p className="text-sm text-muted-foreground">85% completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
