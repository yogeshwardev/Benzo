'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, TrendingUp, Wallet, Award, Settings, LogOut, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const studentNav = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  ]

  const instructorNav = [
    { name: 'Dashboard', href: '/instructor', icon: Home },
    { name: 'My Courses', href: '/instructor/courses', icon: BookOpen },
    { name: 'Live Classes', href: '/instructor/live-classes', icon: Users },
    { name: 'Analytics', href: '/instructor/analytics', icon: TrendingUp },
    { name: 'Settings', href: '/instructor/settings', icon: Settings },
  ]

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Payments', href: '/admin/payments', icon: TrendingUp },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const navItems = studentNav // Default to student nav for now

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-background border-r hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SkillForge</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">{children}</div>
    </div>
  )
}
