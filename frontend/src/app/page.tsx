import { Metadata } from 'next'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { PopularCourses } from '@/components/landing/popular-courses'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Contact } from '@/components/landing/contact'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export const metadata: Metadata = {
  title: 'SkillForge Academy - Master New Skills',
  description: 'A modern learning platform to help you master new skills with expert-led courses.',
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <PopularCourses />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
