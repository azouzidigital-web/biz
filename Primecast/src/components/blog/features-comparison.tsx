import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Star, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Provider {
  name: string
  logo?: string
  rating: number
  channels: string
  quality: string
  uptime: string
  support: string
  price: string
  highlights: string[]
  isRecommended?: boolean
}

const providers: Provider[] = [
  {
    name: 'Veltrix',
    rating: 4.9,
    channels: '15,000+',
    quality: '4K Ultra HD',
    uptime: '99.9%',
    support: '24/7 Live Chat',
    price: '$69/month',
    highlights: ['Best Canadian Content', 'Premium Support', 'No Buffering'],
    isRecommended: true
  },
  {
    name: 'StreamVault Canada',
    rating: 4.2,
    channels: '3,000+',
    quality: 'HD only',
    uptime: '70%',
    support: 'Email Only',
    price: '$129/month',
    highlights: ['Good Sports Coverage']
  },
  {
    name: 'NorthStream IPTV',
    rating: 3.8,
    channels: '4,500+',
    quality: 'HD Only',
    uptime: '85%',
    support: 'Business Hours',
    price: '$130/month',
    highlights: ['Basic Service']
  }
]

const features = [
  'Channel Count',
  'Streaming Quality',
  'Uptime Guarantee',
  'Customer Support',
  'Monthly Price',
  'Canadian Content',
  'Sports Channels',
  'VOD Library',
  'Multi-Device Support'
]

export function FeaturesComparison() {
  return (
    <section id="iptv-provider-comparison" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            IPTV Provider Comparison
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Veltrix compares to other Canadian streaming providers across key features and services.
          </p>
        </div>

        {/* Provider Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {providers.map((provider) => (
            <Card
              key={provider.name}
              className={`p-6 border-2 transition-all duration-300 hover:scale-102 ${
                provider.isRecommended
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-102'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {provider.isRecommended && (
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  <Trophy className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              )}

              <h3 className="text-xl font-bold mb-2 text-foreground">
                {provider.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(provider.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{provider.rating}/5</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channels:</span>
                  <span className="font-medium">{provider.channels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="font-medium">{provider.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">{provider.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium text-primary">{provider.price}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {provider.highlights.map((highlight) => (
                    <Badge
                      key={highlight}
                      variant="secondary"
                      className="text-xs"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">
                    Features
                  </th>
                  {providers.map((provider) => (
                    <th
                      key={provider.name}
                      className={`text-center p-4 font-semibold ${
                        provider.isRecommended ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {provider.name}
                      {provider.isRecommended && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                          Best
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Channel Count</td>
                  <td className="p-4 text-center text-primary font-semibold">15,000+</td>
                  <td className="p-4 text-center">3,000+</td>
                  <td className="p-4 text-center">4,500+</td>
                </tr>
                <tr className="border-b border-border bg-muted/20">
                  <td className="p-4 font-medium text-foreground">4K Streaming</td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Uptime Guarantee</td>
                  <td className="p-4 text-center text-primary font-semibold">99.9%</td>
                  <td className="p-4 text-center">70%</td>
                  <td className="p-4 text-center">85%</td>
                </tr>
                <tr className="border-b border-border bg-muted/20">
                  <td className="p-4 font-medium text-foreground">24/7 Support</td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">VOD Library</td>
                  <td className="p-4 text-center text-primary font-semibold">50,000+</td>
                  <td className="p-4 text-center">20,000+</td>
                  <td className="p-4 text-center">10,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            * Data based on testing conducted in December 2024. Results may vary by location and internet connection.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ready to experience the best IPTV service?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of satisfied customers with Veltrix IPTV's premium streaming experience.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/#pricing" className="flex items-center gap-2">
                View Our Pricing Plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
