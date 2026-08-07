'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, DollarSign, Edit, Eye, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await api.getInstructorCourses()
      setCourses(data)
    } catch (error) {
      console.error('Failed to load courses:', error)
      // Use mock data if API fails
      setCourses([
        {
          id: '1',
          title: 'Python for Data Science',
          category: 'Data Science',
          difficulty: 'Intermediate',
          price: 699,
          students: 450,
          revenue: 31500,
          rating: 4.9,
          isPublished: true,
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Web Development with AI',
          category: 'Web Development',
          difficulty: 'Intermediate',
          price: 699,
          students: 380,
          revenue: 26600,
          rating: 4.7,
          isPublished: true,
          createdAt: '2024-01-05',
        },
        {
          id: '3',
          title: 'Advanced Machine Learning',
          category: 'Data Science',
          difficulty: 'Advanced',
          price: 699,
          students: 0,
          revenue: 0,
          rating: 0,
          isPublished: false,
          createdAt: '2024-01-10',
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Button asChild>
            <Link href="/instructor/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first course to start teaching
              </p>
              <Button asChild>
                <Link href="/instructor/courses/new">Create Course</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        course.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>₹{course.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/instructor/courses/${course.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
