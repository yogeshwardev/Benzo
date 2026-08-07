'use client'

import { motion } from 'framer-motion'
import { Video, Users, Clock, Award, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: Video,
    title: 'HD Video Lessons',
    description: 'Access high-quality video content with professional production value and clear explanations.',
  },
  {
    icon: Users,
    title: 'Live Classes',
    description: 'Join interactive live sessions with instructors, ask questions, and get real-time feedback.',
  },
  {
    icon: Clock,
    title: 'Learn at Your Pace',
    description: 'Access courses 24/7. Learn whenever and wherever you want with lifetime access.',
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Earn recognized certificates upon course completion to showcase your skills.',
  },
  {
    icon: Zap,
    title: 'Hands-on Projects',
    description: 'Apply what you learn with real-world projects and practical assignments.',
  },
  {
    icon: Shield,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with years of experience in their fields.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SkillForge?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the best learning experience with cutting-edge features and expert instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
