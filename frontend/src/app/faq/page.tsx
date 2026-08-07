'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const faqs = [
    {
      id: '1',
      category: 'General',
      question: 'What is SkillForge Academy?',
      answer: 'SkillForge Academy is an online learning platform offering high-quality courses in programming, data science, web development, and more. Our courses are created by industry experts and designed to help you gain practical skills for your career.'
    },
    {
      id: '2',
      category: 'General',
      question: 'How do I get started?',
      answer: 'Simply create a free account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately with our free courses or purchase premium courses for deeper learning.'
    },
    {
      id: '3',
      category: 'Pricing',
      question: 'How much do courses cost?',
      answer: 'Course prices vary depending on the content and instructor. Most courses are priced between ₹499 to ₹1999. We also offer bundle discounts and seasonal promotions. Check individual course pages for current pricing.'
    },
    {
      id: '4',
      category: 'Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit cards, debit cards, UPI, net banking, and popular wallets through our secure payment partner Razorpay.'
    },
    {
      id: '5',
      category: 'Refunds',
      question: 'What is your refund policy?',
      answer: 'We offer a 7-day money-back guarantee. If you\'ve completed less than 10% of the course and are not satisfied, you can request a full refund. Refunds are processed within 5-7 business days.'
    },
    {
      id: '6',
      category: 'Access',
      question: 'How long do I have access to a course?',
      answer: 'Once you purchase a course, you have lifetime access as long as the platform exists. You can learn at your own pace and revisit the material whenever you need.'
    },
    {
      id: '7',
      category: 'Access',
      question: 'Can I download course videos?',
      answer: 'Some courses allow video downloads for offline viewing. Check the course description for specific features. Most resources and assignments can be downloaded.'
    },
    {
      id: '8',
      category: 'Certificates',
      question: 'Do I get a certificate upon completion?',
      answer: 'Yes! Upon successfully completing a course and all required assignments, you\'ll receive a verified certificate that you can share on LinkedIn and include in your resume.'
    },
    {
      id: '9',
      category: 'Certificates',
      question: 'Are the certificates recognized by employers?',
      answer: 'Our certificates are recognized by many companies as proof of your skills. While they\'re not formal academic degrees, they demonstrate practical knowledge and commitment to learning.'
    },
    {
      id: '10',
      category: 'Technical',
      question: 'What are the technical requirements?',
      answer: 'You need a computer or mobile device with internet access. For programming courses, you\'ll need to install the required software (we provide installation guides). Most courses work on Windows, Mac, and Linux.'
    },
    {
      id: '11',
      category: 'Technical',
      question: 'What if I get stuck on a lesson?',
      answer: 'Each course has a discussion section where you can ask questions. Our instructors and community members are there to help. You can also reach out to our support team for technical issues.'
    },
    {
      id: '12',
      category: 'Instructors',
      question: 'How can I become an instructor?',
      answer: 'We\'re always looking for qualified instructors! Apply through our "Become an Instructor" page. We review applications and will contact you if your expertise matches our needs.'
    },
    {
      id: '13',
      category: 'Support',
      question: 'How do I contact support?',
      answer: 'You can reach our support team via email at support@skillforge.com or through the contact form on our website. We typically respond within 24 hours.'
    },
    {
      id: '14',
      category: 'Support',
      question: 'Is there a mobile app?',
      answer: 'Yes! Our mobile app is available for both iOS and Android. Download it to learn on the go with full access to your courses and progress.'
    }
  ]

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about SkillForge Academy
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="space-y-4">
              {faqs.filter(faq => faq.category === category).map((faq) => (
                <Card key={faq.id}>
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
                  >
                    <CardTitle className="flex items-center justify-between text-lg">
                      {faq.question}
                      {openItem === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  {openItem === faq.id && (
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
