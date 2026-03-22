import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Star, Zap, Shield } from 'lucide-react'

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

const plans: PricingPlan[] = [
  {
    name: 'Basic Plan',
    price: '$15',
    period: '/month',
    description: 'Perfect for casual viewers',
    features: [
      '5,000+ Live Channels',
      'HD Streaming Quality',
      '24/7 Customer Support',
      '3 Device Connections',
      'Basic EPG Guide'
    ],
    cta: 'Start Basic Plan'
  },
  {
    name: 'Premium Plan',
    price: '$25',
    period: '/month',
    description: 'Our most popular choice',
    features: [
      '10,000+ Live Channels',
      '4K Ultra HD Streaming',
      '24/7 Priority Support',
      '5 Device Connections',
      'Advanced EPG Guide',
      '25,000+ VOD Movies',
      'Sports Package Included'
    ],
    popular: true,
    cta: 'Choose Premium'
  },
  {
    name: 'Ultimate Plan',
    price: '$35',
    period: '/month',
    description: 'Complete entertainment solution',
    features: [
      '15,000+ Live Channels',
      '4K Ultra HD + HDR',
      '24/7 VIP Support',
      'Unlimited Devices',
      'Premium EPG Guide',
      '50,000+ VOD Movies',
      'All Sports Packages',
      'Adult Content Access',
      'Catch-up TV (7 days)'
    ],
    cta: 'Go Ultimate'
  }
]

export function PricingComparison() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All plans include access to Canadian channels, 99.9% uptime guarantee, 
            and instant activation. No setup fees or hidden costs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                plan.popular
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-secondary hover:bg-secondary/90'
                }`}
                size="lg"
              >
                {plan.popular && <Zap className="h-4 w-4 mr-2" />}
                {plan.cta}
              </Button>

              {index === 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  30-day money-back guarantee
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Need help choosing? Our experts are here to help you find the perfect plan.
          </p>
          <Button variant="outline" size="sm">
            Contact Our Team
          </Button>
        </div>
      </div>
    </section>
  )
}
