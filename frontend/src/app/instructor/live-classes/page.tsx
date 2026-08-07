'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Calendar, Users, Clock, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function InstructorLiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const data = await api.getLiveClasses()
      setClasses(data)
    } catch (error) {
      console.error('Failed to load classes:', error)
      // Use mock data if API fails
      setClasses([
        {
          id: '1',
          title: 'Python Data Analysis Q&A',
          course: 'Python for Data Science',
          scheduledAt: '2024-01-15T15:00:00Z',
          duration: 60,
          status: 'SCHEDULED',
          enrolled: 45,
        },
        {
          id: '2',
          title: 'Web Development Project Review',
          course: 'Web Development with AI',
          scheduledAt: '2024-01-20T17:00:00Z',
          duration: 90,
          status: 'SCHEDULED',
          enrolled: 32,
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
          <h1 className="text-3xl font-bold">Live Classes</h1>
          <Button asChild>
            <Link href="/instructor/live-classes/new">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Class
            </Link>
          </Button>
        </div>

        {classes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No live classes scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Schedule your first live class to engage with students
              </p>
              <Button asChild>
                <Link href="/instructor/live-classes/new">Schedule Class</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Video className="mr-2 h-5 w-5 text-primary" />
                    {classItem.title}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        classItem.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800'
                          : classItem.status === 'LIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {classItem.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(classItem.scheduledAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{classItem.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{classItem.enrolled} enrolled</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {classItem.course}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="mr-2 h-4 w-4" />
                        Start Class
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
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
