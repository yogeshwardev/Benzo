'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Star, Zap, Target, Award, Lock } from 'lucide-react'

export default function AchievementsPage() {
  const achievements = [
    {
      id: '1',
      title: 'First Course',
      description: 'Enroll in your first course',
      icon: Target,
      unlocked: true,
      unlockedAt: '2024-01-05',
    },
    {
      id: '2',
      title: 'Speed Learner',
      description: 'Complete a course in 7 days',
      icon: Zap,
      unlocked: true,
      unlockedAt: '2024-01-10',
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Get 100% on an assignment',
      icon: Star,
      unlocked: false,
    },
    {
      id: '4',
      title: 'Certified',
      description: 'Earn your first certificate',
      icon: Award,
      unlocked: true,
      unlockedAt: '2024-01-15',
    },
    {
      id: '5',
      title: 'Scholar',
      description: 'Complete 5 courses',
      icon: Trophy,
      unlocked: false,
    },
    {
      id: '6',
      title: 'Top Student',
      description: 'Reach top 10 on leaderboard',
      icon: Trophy,
      unlocked: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Achievements</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={achievement.unlocked ? '' : 'opacity-50'}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary to-secondary'
                        : 'bg-muted'
                    }`}
                  >
                    {achievement.unlocked ? (
                      <achievement.icon className="h-6 w-6 text-white" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
