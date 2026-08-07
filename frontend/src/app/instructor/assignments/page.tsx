'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, CheckCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      const data = await api.getAssignments()
      setAssignments(data)
    } catch (error) {
      console.error('Failed to load assignments:', error)
      setAssignments([
        {
          id: '1',
          title: 'Data Analysis Project',
          course: 'Python for Data Science',
          dueDate: '2024-01-15',
          submissions: 35,
          maxMarks: 100,
          pendingReview: 12,
        },
        {
          id: '2',
          title: 'Build a Simple App',
          course: 'Web Development with AI',
          dueDate: '2024-01-20',
          submissions: 28,
          maxMarks: 100,
          pendingReview: 8,
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
        <h1 className="text-3xl font-bold mb-6">Assignments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{assignment.submissions} submissions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {assignment.pendingReview > 0 && (
                    <div className="flex items-center text-orange-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>{assignment.pendingReview} pending review</span>
                    </div>
                  )}
                  <Button className="w-full">Review Submissions</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
