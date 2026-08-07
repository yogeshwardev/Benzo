import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Cookie, Database, UserCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - SkillForge Academy',
  description: 'Learn how SkillForge Academy protects your privacy and handles your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2024
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At SkillForge Academy, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Name and email address</li>
                <li>Profile information and photos</li>
                <li>Payment information (processed securely)</li>
                <li>Course enrollment data</li>
                <li>Progress and certificates</li>
              </ul>

              <h3 className="font-semibold mt-4">Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Pages visited and time spent</li>
                <li>Course completion rates</li>
                <li>Device information</li>
                <li>IP address and location</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-primary" />
                How We Protect Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>256-bit SSL encryption for all data transfers</li>
                <li>Secure payment processing via Razorpay</li>
                <li>Regular security audits and updates</li>
                <li>Access restricted to authorized personnel</li>
                <li>Data backups with encryption</li>
                <li>Compliance with GDPR and other regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cookie className="mr-2 h-5 w-5 text-primary" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie settings through your browser.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-primary" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use trusted third-party services:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Razorpay</strong> - Payment processing</li>
                <li><strong>Google</strong> - Authentication and analytics</li>
                <li><strong>Resend</strong> - Email delivery</li>
                <li><strong>LiveKit</strong> - Video streaming</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For privacy-related questions, contact us at: <a href="mailto:privacy@skillforge.com" className="text-primary hover:underline">privacy@skillforge.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
