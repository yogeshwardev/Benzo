'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Clock, Video, BookOpen, FileText } from 'lucide-react'

export default function CalendarPage() {
  const schedule = [
    {
      id: '1',
      title: 'Live Class: Python Data Analysis',
      date: '2024-01-15',
      time: '3:00 PM',
      course: 'Python for Data Science',
      type: 'live-class',
    },
    {
      id: '2',
      title: 'Assignment Due: Web Development',
      date: '2024-01-20',
      time: '11:59 PM',
      course: 'Web Development with AI',
      type: 'assignment',
    },
    {
      id: '3',
      title: 'Quiz: DevOps Fundamentals',
      date: '2024-01-22',
      time: '2:00 PM',
      course: 'DevOps Fundamentals',
      type: 'quiz',
    },
    {
      id: '4',
      title: 'Live Class: Machine Learning',
      date: '2024-01-25',
      time: '4:00 PM',
      course: 'Python for Data Science',
      type: 'live-class',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'live-class':
        return <Video className="h-5 w-5 text-blue-500" />
      case 'assignment':
        return <FileText className="h-5 w-5 text-orange-500" />
      case 'quiz':
        return <BookOpen className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Learning Calendar</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              Your Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
