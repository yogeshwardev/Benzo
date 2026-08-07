'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const wishlist = [
    {
      id: '1',
      title: 'Python for Data Science',
      price: 699,
      instructor: 'Jane Smith',
      thumbnail: '/courses/python.jpg',
    },
    {
      id: '2',
      title: 'Web Development with AI',
      price: 699,
      instructor: 'Mike Johnson',
      thumbnail: '/courses/web-dev-ai.jpg',
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Wishlist</h1>

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save courses you want to enroll in later
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((course) => (
              <Card key={course.id}>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-primary/50" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.instructor}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="font-bold">₹{course.price}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <ShoppingCart className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
