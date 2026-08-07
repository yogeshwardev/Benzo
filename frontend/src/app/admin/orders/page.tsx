'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCircle, XCircle, DollarSign, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await api.getAdminPayments()
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([
        {
          id: '1',
          user: 'John Doe',
          course: 'Python for Data Science',
          amount: 699,
          status: 'COMPLETED',
          paymentMethod: 'UPI',
          createdAt: '2024-01-10',
        },
        {
          id: '2',
          user: 'Jane Smith',
          course: 'Web Development with AI',
          amount: 699,
          status: 'COMPLETED',
          paymentMethod: 'Card',
          createdAt: '2024-01-10',
        },
        {
          id: '3',
          user: 'Mike Johnson',
          course: 'DevOps Fundamentals',
          amount: 699,
          status: 'PENDING',
          paymentMethod: 'UPI',
          createdAt: '2024-01-09',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Course</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Method</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                      <td className="p-4">{order.user}</td>
                      <td className="p-4">{order.course}</td>
                      <td className="p-4 font-semibold">₹{order.amount}</td>
                      <td className="p-4 text-muted-foreground">{order.paymentMethod}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {order.status === 'COMPLETED' && (
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <DollarSign className="h-4 w-4" />
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
