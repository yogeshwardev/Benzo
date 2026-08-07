'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Video, Archive } from 'lucide-react'

export default function DownloadsPage() {
  const downloads = [
    {
      id: '1',
      title: 'Python Cheat Sheet',
      type: 'PDF',
      size: '2.5 MB',
      course: 'Python for Data Science',
      url: '/downloads/python-cheatsheet.pdf',
    },
    {
      id: '2',
      title: 'Web Development Resources',
      type: 'ZIP',
      size: '15.2 MB',
      course: 'Web Development with AI',
      url: '/downloads/web-resources.zip',
    },
    {
      id: '3',
      title: 'Data Analysis Templates',
      type: 'ZIP',
      size: '8.7 MB',
      course: 'Python for Data Science',
      url: '/downloads/data-templates.zip',
    },
    {
      id: '4',
      title: 'DevOps Playbook',
      type: 'PDF',
      size: '5.1 MB',
      course: 'DevOps Fundamentals',
      url: '/downloads/devops-playbook.pdf',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'ZIP':
        return <Archive className="h-5 w-5 text-blue-500" />
      case 'VIDEO':
        return <Video className="h-5 w-5 text-purple-500" />
      default:
        return <Download className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Downloads</h1>

        {downloads.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Download className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No downloads available</h3>
              <p className="text-muted-foreground mb-4">
                Downloadable resources will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {downloads.map((item) => (
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
                        <p className="text-sm text-muted-foreground">
                          {item.course} • {item.size}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
