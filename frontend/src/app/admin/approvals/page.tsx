'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, User, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState([
    {
      id: '1',
      type: 'COURSE',
      title: 'Advanced React Patterns',
      user: 'Emily Brown',
      course: 'Web Development',
      status: 'PENDING',
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      type: 'INSTRUCTOR',
      title: 'New Instructor Application',
      user: 'David Lee',
      course: 'Machine Learning',
      status: 'PENDING',
      createdAt: '2024-01-08',
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleApprove = async (id: string) => {
    setApprovals(approvals.map((a) => a.id === id ? { ...a, status: 'APPROVED' } : a))
  }

  const handleReject = async (id: string) => {
    setApprovals(approvals.map((a) => a.id === id ? { ...a, status: 'REJECTED' } : a))
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Approvals</h1>

        {approvals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pending approvals</h3>
              <p className="text-muted-foreground">
                All caught up!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <Card key={approval.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            approval.type === 'COURSE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {approval.type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            approval.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : approval.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {approval.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{approval.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{approval.user}</span>
                        </div>
                        {approval.course && (
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{approval.course}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(approval.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {approval.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(approval.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
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
