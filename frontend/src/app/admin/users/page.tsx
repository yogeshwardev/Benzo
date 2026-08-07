'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Search, Shield, MoreVertical, Ban, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await api.getAdminUsers()
      setUsers(data)
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'STUDENT',
          isEmailVerified: true,
          createdAt: '2024-01-01',
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'INSTRUCTOR',
          isEmailVerified: true,
          createdAt: '2024-01-02',
          status: 'ACTIVE',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'STUDENT',
          isEmailVerified: false,
          createdAt: '2024-01-05',
          status: 'ACTIVE',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Verified</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'INSTRUCTOR'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isEmailVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Ban className="h-4 w-4 text-destructive" />
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
