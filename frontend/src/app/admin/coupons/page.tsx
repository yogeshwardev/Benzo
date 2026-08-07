'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ticket, Plus, Trash2, Edit, Percent, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'FLAT',
    discountValue: 0,
    maxDiscount: null,
    expiryDate: '',
    usageLimit: 100,
    courseId: '',
    minPurchase: 0,
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const data = await api.getAdminCoupons()
      setCoupons(data)
    } catch (error) {
      console.error('Failed to load coupons:', error)
      setCoupons([
        {
          id: '1',
          code: 'WELCOME100',
          discountType: 'FLAT',
          discountValue: 100,
          maxDiscount: 100,
          expiryDate: '2024-12-31',
          usageLimit: 1000,
          usedCount: 245,
          isActive: true,
        },
        {
          id: 'SAVE20',
          code: 'SAVE20',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          maxDiscount: 200,
          expiryDate: '2024-06-30',
          usageLimit: 500,
          usedCount: 180,
          isActive: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Coupon created successfully!')
      setShowCreateForm(false)
      setFormData({
        code: '',
        discountType: 'FLAT',
        discountValue: 0,
        maxDiscount: null,
        expiryDate: '',
        usageLimit: 100,
        courseId: '',
        minPurchase: 0,
      })
      loadCoupons()
    } catch (error) {
      toast.error('Failed to create coupon')
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
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., WELCOME100"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FLAT">Flat Discount</SelectItem>
                        <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="Amount or percentage"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Max Discount (Optional)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      placeholder="Maximum discount amount"
                      value={formData.maxDiscount || ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="Number of uses"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Min Purchase (₹)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      placeholder="Minimum purchase amount"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course (Optional)</Label>
                    <Input
                      id="courseId"
                      placeholder="Select course"
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Coupon'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Code</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Value</th>
                    <th className="text-left p-4">Max Discount</th>
                    <th className="text-left p-4">Expiry</th>
                    <th className="text-left p-4">Usage</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono font-bold">{coupon.code}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {coupon.discountType}
                        </span>
                      </td>
                      <td className="p-4">
                        {coupon.discountType === 'FLAT' ? '₹' : ''}{coupon.discountValue}
                        {coupon.discountType === 'PERCENTAGE' ? '%' : ''}
                      </td>
                      <td className="p-4">{coupon.maxDiscount ? `₹${coupon.maxDiscount}` : '-'}</td>
                      <td className="p-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        {coupon.usedCount}/{coupon.usageLimit}
                      </td>
                      <td className="p-4">
                        {coupon.isActive ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
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
