'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDuration } from '@/lib/utils'

const courses = [
  {
    id: '1',
    title: 'C Programming Masterclass',
    description: 'Learn C programming from scratch with hands-on projects and real-world examples.',
    thumbnail: '/courses/c-programming.jpg',
    price: 699,
    instructor: 'John Doe',
    rating: 4.8,
    students: 15000,
    duration: 7200,
    category: 'Programming',
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Master Python programming and data science libraries like Pandas, NumPy, and more.',
    thumbnail: '/courses/python.jpg',
    price: 699,
    instructor: 'Jane Smith',
    rating: 4.9,
    students: 25000,
    duration: 10800,
    category: 'Data Science',
  },
  {
    id: '3',
    title: 'Web Development with AI',
    description: 'Build modern web applications using AI tools and technologies.',
    thumbnail: '/courses/web-dev-ai.jpg',
    price: 699,
    instructor: 'Mike Johnson',
    rating: 4.7,
    students: 12000,
    duration: 14400,
    category: 'Web Development',
  },
  {
    id: '4',
    title: 'DevOps Fundamentals',
    description: 'Learn Docker, Kubernetes, CI/CD, and cloud deployment strategies.',
    thumbnail: '/courses/devops.jpg',
    price: 699,
    instructor: 'Sarah Williams',
    rating: 4.8,
    students: 8000,
    duration: 9600,
    category: 'DevOps',
  },
]

export function PopularCourses() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular courses loved by thousands of students worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/50" />
              </div>
              
              <div className="p-4">
                <div className="text-xs font-medium text-primary mb-2">
                  {course.category}
                </div>
                
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">
                    {formatPrice(course.price)}
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              View All Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
