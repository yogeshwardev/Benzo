'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How do I access the courses after purchase?',
    answer: 'Once you purchase a course, you get lifetime access to all course materials including video lessons, resources, and updates. You can access them anytime from your dashboard.',
  },
  {
    question: 'Do I get a certificate upon completion?',
    answer: 'Yes! Upon completing a course, you will receive a verified certificate that you can share on LinkedIn and include in your resume. Certificates include QR codes for verification.',
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'We offer a 7-day money-back guarantee on all courses. If you\'re not satisfied with your purchase, contact our support team within 7 days for a full refund.',
  },
  {
    question: 'Are the courses suitable for beginners?',
    answer: 'Yes! We offer courses for all skill levels - from beginner to advanced. Each course clearly indicates its difficulty level and prerequisites.',
  },
  {
    question: 'Do you offer live classes?',
    answer: 'Yes, we offer live classes for most courses. Live classes are scheduled regularly and you can join them interactively. Recordings are also available for later viewing.',
  },
  {
    question: 'How do the referral programs work?',
    answer: 'Every student gets a unique referral code. When someone signs up using your code and makes their first purchase, both you and the referee get ₹200 wallet credit that can be used for course purchases.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform and courses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 transition-transform',
                    openIndex === index ? 'rotate-180' : ''
                  )}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
