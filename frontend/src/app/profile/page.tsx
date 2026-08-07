'use client'

import { useAuth } from '@/lib/auth-context'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, MapPin, BookOpen, Award, Wallet, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    redirect('/login')
  }

  const handleLogout = () => {
    logout()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>3 Enrolled Courses</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>1 Certificate</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span>₹200 Wallet Balance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full px-4 py-2 rounded-xl border bg-muted focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 123 456 7890"
                        className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Education</label>
                      <input
                        type="text"
                        placeholder="Your highest qualification"
                        className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <textarea
                      rows={3}
                      placeholder="Your address"
                      className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <Button>Save Changes</Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <Button>Update Password</Button>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
