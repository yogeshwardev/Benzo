'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const plans = [
  {
    name: 'Basic',
    price: 699,
    description: 'Perfect for individual learners',
    features: [
      'Access to 1 course',
      'HD video lessons',
      'Course completion certificate',
      'Community access',
      'Email support',
    ],
    limitations: [
      'No live classes',
      'No mentorship',
      'No projects review',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 1499,
    description: 'Best for serious learners',
    features: [
      'Access to 5 courses',
      'HD video lessons',
      'Live classes access',
      'Certificate of completion',
      'Priority support',
      'Project review',
      'Mentorship sessions',
    ],
    limitations: [
      'No offline access',
      'No custom learning path',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 4999,
    description: 'For teams and organizations',
    features: [
      'Unlimited course access',
      'HD video lessons',
      'Live classes access',
      'Custom certificates',
      'Dedicated support',
      'Team management',
      'Custom learning paths',
      'Offline access',
      'Analytics dashboard',
    ],
    limitations: [],
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include a 7-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary to-primary/90 text-white shadow-2xl scale-105'
                  : 'bg-background border shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                <div className="text-4xl font-bold">
                  {formatPrice(plan.price)}
                  <span className="text-lg font-normal">/course</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start space-x-3 opacity-60">
                    <X className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-red-500'}`} />
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant={plan.popular ? 'secondary' : 'default'}
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
