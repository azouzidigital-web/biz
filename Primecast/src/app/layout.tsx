import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ViewportHeightAdjuster } from '@/hooks/use-viewport-height';
import { ImagePreloader } from '@/components/image-preloader';
import { ChannelPreloader } from '@/components/channel-preloader';
import { ChatGate } from '@/components/ui/chat-gate';
import { ClientSideScripts } from '@/components/client-side-scripts';
import FacebookConversions from '@/components/facebook-conversions';
import { TurnstileProtection } from '@/components/protection/turnstile-protection';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://businessexplained.com'),
  title: 'Veltrix — Best Selling Business eBooks',
  description: 'Explore our top-selling business eBooks to level up your skills, strategy, and leadership.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://businessexplained.com',
    siteName: 'Veltrix',
    title: 'Veltrix — Best Selling Business eBooks',
    description: 'Explore our top-selling business eBooks to level up your skills, strategy, and leadership.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veltrix — Best Selling Business eBooks',
    description: 'Explore our top-selling business eBooks to level up your skills, strategy, and leadership.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'eab7364f98e79e69',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon-32x32.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon-32x32.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Preload critical images for faster loading */}
        <link rel="preload" as="image" href="/images/Ted Lasso.webp" />
        <link rel="preload" as="image" href="/images/the last of us.webp" />
        <link rel="preload" as="image" href="/images/House of the Dragon.webp" />
        <link rel="preload" as="image" href="/images/Clarkson's Farm.webp" />
        {/* Preload critical channel logos */}
        <link rel="preload" as="image" href="/channel_guide/logo_cbctelevision.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_ctvhd.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_tsn.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_sportsnet.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_cnninternational.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_bbcnews.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_disneychannel.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_history.webp" />
        {/* Preload most important channel logos */}
        <link rel="preload" as="image" href="/channel_guide/logo_cbctelevision.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_ctvhd.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_tsn.webp" />
        <link rel="preload" as="image" href="/channel_guide/logo_sportsnet.webp" />
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Preconnect to our own domain for channel images */}
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="/" />
        
        {/* Structured data json for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Business Explained",
              "url": "https://businessexplained.com",
              "logo": "https://businessexplained.com/favicon-32x32.png",
              "sameAs": [
                "https://businessexplained.com/blog",
                "https://businessexplained.com/contact"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "url": "https://businessexplained.com/contact"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ViewportHeightAdjuster />
        <ImagePreloader />
        <ChannelPreloader />
        <FacebookConversions />
        <TurnstileProtection>
          {children}
        </TurnstileProtection>
        <Toaster />
        <div id="fixed-element-container" />
        
        {/* Client-side only scripts to avoid hydration mismatches */}
        <ClientSideScripts />
        
        {/* Live Chat Widget (disabled on subscribe pages) */}
        <ChatGate />
      </body>
    </html>
  );
}
