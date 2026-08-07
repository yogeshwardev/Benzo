'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, Settings, Mail, Globe, CreditCard, Shield, Bell } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'SkillForge Academy',
    siteDescription: 'Learn skills that matter',
    contactEmail: 'support@skillforge.com',
    supportPhone: '+91 98765 43210',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    stripeSecretKey: '',
    stripePublishableKey: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    googleClientId: '',
    googleClientSecret: '',
    notificationEmail: 'notifications@skillforge.com',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Platform Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the platform for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable/disable new user registrations
                  </p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                  placeholder="sk_live_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
                <Input
                  id="stripePublishableKey"
                  type="password"
                  value={settings.stripePublishableKey}
                  onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                  placeholder="pk_live_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                <Input
                  id="razorpayKeyId"
                  type="password"
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  placeholder="rzp_live_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                <Input
                  id="razorpayKeySecret"
                  type="password"
                  value={settings.razorpayKeySecret}
                  onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                  placeholder="razorpay_secret_..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                OAuth Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleClientId">Google Client ID</Label>
                <Input
                  id="googleClientId"
                  type="password"
                  value={settings.googleClientId}
                  onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })}
                  placeholder="apps.googleusercontent.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleClientSecret">Google Client Secret</Label>
                <Input
                  id="googleClientSecret"
                  type="password"
                  value={settings.googleClientSecret}
                  onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })}
                  placeholder="GOCSPX-..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button type="button" variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
