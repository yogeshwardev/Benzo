'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Play, BookOpen, Users, Award } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="animate-pulse mr-2">🎓</span>
              New: AI-Powered Learning Paths
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Master New Skills with{' '}
              <span className="text-primary">Expert-Led Courses</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Join 100,000+ learners worldwide. Access 50+ courses in programming, 
              development, and more. Learn at your own pace with live classes and 
              hands-on projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link href="/demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">100K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">Start Learning Today</p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -left-8 top-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Course Completed!</p>
                  <p className="text-sm text-muted-foreground">Web Development</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -right-8 bottom-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  🔥
                </div>
                <div>
                  <p className="font-semibold">Live Class Starting</p>
                  <p className="text-sm text-muted-foreground">In 30 minutes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
