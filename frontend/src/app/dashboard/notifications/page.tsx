'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, X, FileText, BookOpen, Award, Calendar, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'ASSIGNMENT',
      title: 'New Assignment Posted',
      message: 'A new assignment has been posted for Web Development with AI',
      actionUrl: '/dashboard/assignments',
      isRead: false,
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      type: 'LIVE_CLASS',
      title: 'Live Class Reminder',
      message: 'Your live class starts in 30 minutes',
      actionUrl: '/courses/1',
      isRead: false,
      createdAt: '2024-01-10T14:30:00Z',
    },
    {
      id: '3',
      type: 'PAYMENT',
      title: 'Payment Successful',
      message: 'Your payment for Python for Data Science was successful',
      actionUrl: '/dashboard/courses',
      isRead: true,
      createdAt: '2024-01-08T15:00:00Z',
    },
    {
      id: '4',
      type: 'COURSE_COMPLETION',
      title: 'Certificate Earned',
      message: 'Congratulations! You earned a certificate for C Programming',
      actionUrl: '/dashboard/certificates',
      isRead: true,
      createdAt: '2024-01-05T12:00:00Z',
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT':
        return <FileText className="h-5 w-5 text-orange-500" />
      case 'LIVE_CLASS':
        return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'PAYMENT':
        return <DollarSign className="h-5 w-5 text-green-500" />
      case 'COURSE_COMPLETION':
        return <Award className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex items-start space-x-4 hover:bg-muted/50 transition-colors ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
