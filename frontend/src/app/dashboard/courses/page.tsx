'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Award, Play } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      const data = await api.getMyEnrollments()
      setEnrollments(data)
    } catch (error) {
      console.error('Failed to load enrollments:', error)
      // Use mock data if API fails
      setEnrollments([
        {
          id: '1',
          course: {
            id: '1',
            title: 'Python for Data Science',
            instructor: 'Jane Smith',
            thumbnail: '/courses/python.jpg',
          },
          progress: 65,
          completed: false,
          enrolledAt: '2024-01-01',
        },
        {
          id: '2',
          course: {
            id: '2',
            title: 'Web Development with AI',
            instructor: 'Mike Johnson',
            thumbnail: '/courses/web-dev-ai.jpg',
          },
          progress: 35,
          completed: false,
          enrolledAt: '2024-01-05',
        },
      ])
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
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>

        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/50" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{enrollment.course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {enrollment.course.instructor}
                  </p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/courses/${enrollment.course.id}`}>
                    <Button className="w-full" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
