import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, AlertCircle, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - SkillForge Academy',
  description: 'Terms and conditions for using SkillForge Academy platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2024
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using SkillForge Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You must be at least 13 years old to create an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>Provide accurate and complete information</li>
                <li>One account per person - no sharing accounts</li>
                <li>Notify us immediately of unauthorized access</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                Course Access and Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Courses are for personal, non-commercial use</li>
                <li>Do not redistribute course materials</li>
                <li>Respect intellectual property rights</li>
                <li>Complete assignments honestly</li>
                <li>Lifetime access as long as the platform exists</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                Payments and Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Payment Terms</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All prices are in INR</li>
                <li>Secure payment via Razorpay</li>
                <li>No hidden fees or charges</li>
                <li>Coupons and discounts as advertised</li>
              </ul>

              <h3 className="font-semibold mt-4">Refund Policy</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>7-day money-back guarantee</li>
                <li>Refund if less than 10% of course completed</li>
                <li>Refund processed within 5-7 business days</li>
                <li>Contact support for refund requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Violating any applicable laws</li>
                <li>Infringing on intellectual property</li>
                <li>Spamming or harassing other users</li>
                <li>Attempting to hack or breach security</li>
                <li>Using automated tools to access the platform</li>
                <li>Sharing account credentials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All course content, materials, and intellectual property remain the property of SkillForge Academy and our instructors. You are granted a limited license to access and use the content for personal learning purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account at any time for violation of these terms, without prior notice. Upon termination, your right to use the platform will immediately cease.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                SkillForge Academy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of the platform constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at: <a href="mailto:legal@skillforge.com" className="text-primary hover:underline">legal@skillforge.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
