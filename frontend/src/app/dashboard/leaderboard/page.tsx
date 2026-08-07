'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award, Crown } from 'lucide-react'

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', points: 12500, courses: 8, avatar: 'SJ' },
    { rank: 2, name: 'Mike Chen', points: 11200, courses: 7, avatar: 'MC' },
    { rank: 3, name: 'Emily Davis', points: 10800, courses: 6, avatar: 'ED' },
    { rank: 4, name: 'John Smith', points: 9500, courses: 5, avatar: 'JS' },
    { rank: 5, name: 'Lisa Wang', points: 9200, courses: 5, avatar: 'LW' },
    { rank: 6, name: 'David Brown', points: 8800, courses: 4, avatar: 'DB' },
    { rank: 7, name: 'Anna Lee', points: 8500, courses: 4, avatar: 'AL' },
    { rank: 8, name: 'Tom Wilson', points: 8200, courses: 4, avatar: 'TW' },
    { rank: 9, name: 'You', points: 2500, courses: 3, avatar: 'YO', isCurrentUser: true },
    { rank: 10, name: 'Grace Kim', points: 7800, courses: 3, avatar: 'GK' },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-primary" />
              Top Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    entry.isCurrentUser ? 'bg-primary/10 border-primary' : 'border'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {entry.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.courses} courses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
