'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatDuration } from '@/lib/utils'

export default function AssignmentsPage() {
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
      // Use mock data if API fails
      setAssignments([
        {
          id: '1',
          title: 'Data Analysis Project',
          course: 'Python for Data Science',
          dueDate: '2024-01-15',
          maxMarks: 100,
          submitted: true,
          marks: 85,
          feedback: 'Great work on the analysis! Some improvements needed in visualization.',
          submittedAt: '2024-01-14',
        },
        {
          id: '2',
          title: 'Build a Simple App',
          course: 'Web Development with AI',
          dueDate: '2024-01-20',
          maxMarks: 100,
          submitted: false,
          marks: null,
          feedback: null,
          submittedAt: null,
        },
        {
          id: '3',
          title: 'DevOps Pipeline Setup',
          course: 'DevOps Fundamentals',
          dueDate: '2024-01-25',
          maxMarks: 100,
          submitted: false,
          marks: null,
          feedback: null,
          submittedAt: null,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
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

        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete assignments to earn certificates
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        {assignment.submitted ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Submitted
                          </span>
                        ) : isOverdue(assignment.dueDate) ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {assignment.course}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Max Marks: {assignment.maxMarks}</span>
                        </div>
                      </div>

                      {assignment.submitted ? (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Your Score</span>
                            <span className="text-2xl font-bold text-primary">
                              {assignment.marks}/{assignment.maxMarks}
                            </span>
                          </div>
                          {assignment.feedback && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Feedback:</span> {assignment.feedback}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </Button>
                          <Button variant="outline">View Details</Button>
                        </div>
                      )}
                    </div>
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
