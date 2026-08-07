'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, XCircle, Eye, Edit, Archive, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await api.getAdminCourses()
      setCourses(data)
    } catch (error) {
      console.error('Failed to load courses:', error)
      setCourses([
        {
          id: '1',
          title: 'Python for Data Science',
          instructor: 'Jane Smith',
          category: 'Data Science',
          difficulty: 'Intermediate',
          price: 699,
          students: 450,
          rating: 4.9,
          isPublished: true,
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Web Development with AI',
          instructor: 'Mike Johnson',
          category: 'Web Development',
          difficulty: 'Intermediate',
          price: 699,
          students: 380,
          rating: 4.7,
          isPublished: true,
          createdAt: '2024-01-05',
        },
        {
          id: '3',
          title: 'Advanced Machine Learning',
          instructor: 'Sarah Williams',
          category: 'Data Science',
          difficulty: 'Advanced',
          price: 699,
          students: 0,
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
        <h1 className="text-3xl font-bold mb-6">Course Management</h1>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Course</th>
                    <th className="text-left p-4">Instructor</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Students</th>
                    <th className="text-left p-4">Rating</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary/50" />
                          </div>
                          <div>
                            <p className="font-medium">{course.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{course.instructor}</td>
                      <td className="p-4 text-muted-foreground">{course.category}</td>
                      <td className="p-4 font-semibold">₹{course.price}</td>
                      <td className="p-4">{course.students}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {course.isPublished ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
