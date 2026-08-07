'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isAdmin, isInstructor } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
  ]

  const dashboardLink = isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SkillForge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="sr-only">Toggle theme</span>
              <span className="text-xl">🌙</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardLink}
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
