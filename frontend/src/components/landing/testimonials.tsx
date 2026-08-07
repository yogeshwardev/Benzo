'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Developer',
    content: 'SkillForge transformed my career. The Web Development course helped me land my dream job at a top tech company.',
    avatar: '/avatars/rahul.jpg',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Data Analyst',
    content: 'The Python for Data Science course was incredibly comprehensive. The hands-on projects made learning practical and fun.',
    avatar: '/avatars/priya.jpg',
    rating: 5,
  },
  {
    name: 'Amit Kumar',
    role: 'DevOps Engineer',
    content: 'Best platform for learning DevOps. The instructors are industry experts and the curriculum is up-to-date.',
    avatar: '/avatars/amit.jpg',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied students who have transformed their careers with SkillForge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 relative">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
