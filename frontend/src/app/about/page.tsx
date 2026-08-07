import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Users, Award, BookOpen, Heart, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - SkillForge Academy',
  description: 'Learn about SkillForge Academy mission and team.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About SkillForge Academy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering learners worldwide with cutting-edge skills and expert-led courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>50,000+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Active Learners</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>200+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Expert Courses</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>98%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To democratize education by making high-quality, professional training accessible to everyone, everywhere. We believe that learning should be engaging, practical, and lead to real career opportunities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground">Every course is vetted by industry experts to ensure relevance and accuracy.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Practical Learning</h3>
                  <p className="text-muted-foreground">Hands-on projects and real-world applications, not just theory.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-muted-foreground">Supportive community of learners and instructors helping each other grow.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Continuous Innovation</h3>
                  <p className="text-muted-foreground">Regularly updating content to keep pace with industry changes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SkillForge Academy serves learners from over 150 countries, with courses available in multiple languages. Our platform is designed to work seamlessly across devices and time zones.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Online</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Founded in 2024, SkillForge Academy was born from a simple observation: traditional education wasn't keeping pace with the rapidly changing tech industry. Our founders, experienced educators and industry professionals, set out to create a platform that bridges this gap.
              </p>
              <p className="text-muted-foreground">
                Today, we partner with leading companies and subject matter experts to bring you the most relevant, up-to-date courses in programming, data science, web development, and more. Our commitment to excellence has made us a trusted learning destination for professionals and students alike.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We're always looking for passionate instructors and team members who share our vision. If you're an expert in your field and love teaching, we'd love to hear from you.
              </p>
              <p>
                <a href="/contact" className="text-primary hover:underline font-medium">
                  Contact us →
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
