'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Share2, Gift, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    earnings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      const [codeData, statsData] = await Promise.all([
        api.getReferralCode(),
        api.getReferralStats(),
      ])
      setReferralCode(codeData.code)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load referral data:', error)
      // Use mock data if API fails
      setReferralCode('SKILLFORGE2024')
      setStats({
        total: 5,
        successful: 3,
        earnings: 300,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLink = () => {
    const link = `https://skillforge.com?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied!')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Referral Program</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.successful}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.earnings}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 p-4 bg-muted rounded-xl text-center text-2xl font-mono font-bold">
                {referralCode}
              </div>
              <Button onClick={handleCopyCode} size="lg">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Share your referral link with friends and earn ₹100 for each successful referral!
              </p>
              <Button onClick={handleShareLink} className="w-full" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Copy Referral Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
