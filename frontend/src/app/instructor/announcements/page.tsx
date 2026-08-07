'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Bell, Send, Megaphone } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function InstructorAnnouncementsPage() {
  const [loading, setLoading] = useState(false)
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'New Module Released',
      message: 'A new module on Advanced Python has been added to the course.',
      course: 'Python for Data Science',
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      title: 'Assignment Reminder',
      message: 'Don\'t forget to submit your assignment by Friday!',
      course: 'Web Development with AI',
      createdAt: '2024-01-08',
    },
  ])
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    courseId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Announcement sent!')
      setFormData({ title: '', message: '', courseId: '' })
    } catch (error) {
      toast.error('Failed to send announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Announcements</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="mr-2 h-5 w-5 text-primary" />
                Send Announcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Announcement title"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course (Optional)</Label>
                  <Input
                    id="course"
                    placeholder="Select course"
                    value={formData.courseId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, courseId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your announcement message"
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Sending...' : 'Send Announcement'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.course}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
