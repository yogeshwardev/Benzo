'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Clock, Users, Star, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice, formatDuration } from '@/lib/utils'
import { api } from '@/lib/api'

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await api.getCourses()
      setCourses(data)
    } catch (error) {
      console.error('Failed to load courses:', error)
      // Use mock data if API fails
      setCourses([
        {
          id: '1',
          title: 'C Programming Masterclass',
          description: 'Learn C programming from scratch with hands-on projects and real-world examples.',
          price: 699,
          instructor: 'John Doe',
          rating: 4.8,
          students: 15000,
          duration: 7200,
          category: 'Programming',
          difficulty: 'Beginner',
        },
        {
          id: '2',
          title: 'Python for Data Science',
          description: 'Master Python programming and data science libraries like Pandas, NumPy, and more.',
          price: 699,
          instructor: 'Jane Smith',
          rating: 4.9,
          students: 25000,
          duration: 10800,
          category: 'Data Science',
          difficulty: 'Intermediate',
        },
        {
          id: '3',
          title: 'Web Development with AI',
          description: 'Build modern web applications using AI tools and technologies.',
          price: 699,
          instructor: 'Mike Johnson',
          rating: 4.7,
          students: 12000,
          duration: 14400,
          category: 'Web Development',
          difficulty: 'Intermediate',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', 'Programming', 'Data Science', 'Web Development', 'DevOps']
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">Discover courses to advance your career</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary/50 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary">
                        {course.category}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {course.difficulty}
                      </span>
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
                        <span>{course.students?.toLocaleString() || 0}</span>
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
                      <Button size="sm">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
