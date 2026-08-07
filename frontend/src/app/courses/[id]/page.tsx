'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Users, Star, Play, Check, Download, Share } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function CourseDetailPage({ params }: any) {
  const [activeTab, setActiveTab] = useState('curriculum')

  // Mock course data - replace with actual API call
  const course = {
    id: params.id,
    title: 'Python for Data Science',
    description: 'Master Python programming and data science libraries like Pandas, NumPy, Matplotlib, and more. Build real-world projects and gain hands-on experience.',
    thumbnail: '/courses/python.jpg',
    price: 699,
    instructor: {
      name: 'Jane Smith',
      avatar: '/avatars/jane.jpg',
      bio: 'Data Scientist with 10+ years of experience at top tech companies.',
    },
    rating: 4.9,
    students: 25000,
    duration: 10800,
    category: 'Data Science',
    difficulty: 'Intermediate',
    language: 'English',
    lastUpdated: '2024-01-10',
    features: [
      '50+ hours of video content',
      '20+ hands-on projects',
      'Certificate of completion',
      'Lifetime access',
      'Downloadable resources',
      'Community support',
    ],
    modules: [
      {
        id: '1',
        title: 'Introduction to Python',
        lessons: [
          { id: '1', title: 'Getting Started with Python', duration: 1800, isPreview: true },
          { id: '2', title: 'Python Basics', duration: 2400, isPreview: false },
          { id: '3', title: 'Data Types and Variables', duration: 2100, isPreview: false },
        ],
      },
      {
        id: '2',
        title: 'Data Science Libraries',
        lessons: [
          { id: '4', title: 'Introduction to NumPy', duration: 2700, isPreview: false },
          { id: '5', title: 'Pandas for Data Analysis', duration: 3000, isPreview: false },
          { id: '6', title: 'Data Visualization with Matplotlib', duration: 2400, isPreview: false },
        ],
      },
      {
        id: '3',
        title: 'Machine Learning Basics',
        lessons: [
          { id: '7', title: 'Introduction to ML', duration: 2100, isPreview: false },
          { id: '8', title: 'Supervised Learning', duration: 2700, isPreview: false },
          { id: '9', title: 'Unsupervised Learning', duration: 2400, isPreview: false },
        ],
      },
    ],
  }

  const isEnrolled = false // Replace with actual enrollment check

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm font-medium text-primary">
                    {course.category}
                  </span>
                  <span className="text-sm bg-muted px-2 py-1 rounded-full">
                    {course.difficulty}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {course.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="ml-1">({course.students.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.modules.length} modules</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl bg-background border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary/50" />
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {formatPrice(course.price)}
                    </div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>

                  {isEnrolled ? (
                    <Button size="lg" className="w-full">
                      Continue Learning
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full">
                      Enroll Now
                    </Button>
                  )}

                  <div className="space-y-2 text-sm">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Syllabus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            {['curriculum', 'instructor', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border rounded-xl overflow-hidden">
                        <div className="p-4 bg-muted/50 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Module {moduleIndex + 1}: {module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                          </div>
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="divide-y">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <Play className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDuration(lesson.duration)}
                                  </p>
                                </div>
                              </div>
                              {lesson.isPreview && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  Preview
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
                      <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.9 rating</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>50,000+ students</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>12 courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="font-semibold">Excellent Course!</span>
                        </div>
                        <p className="text-muted-foreground">
                          This course was exactly what I needed. The instructor explains concepts clearly and the projects are very helpful.
                        </p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          John D. • 2 weeks ago
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
