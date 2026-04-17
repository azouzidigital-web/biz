import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ViewportHeightAdjuster } from '@/hooks/use-viewport-height';
import { ChatGate } from '@/components/ui/chat-gate';
import { ClientSideScripts } from '@/components/client-side-scripts';
import FacebookConversions from '@/components/facebook-conversions';
import { TurnstileProtection } from '@/components/protection/turnstile-protection';

export const metadata: Metadata = {
  metadataBase: new URL('https://veltrixbooks.com'),
  title: 'Veltrix — Best Selling Business eBooks',
  description: 'Explore our top-selling business eBooks to level up your skills, strategy, and leadership.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://veltrixbooks.com',
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
        {/* Structured data json for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Veltrix",
              "url": "https://veltrixbooks.com",
              "logo": "https://veltrixbooks.com/Header-logo.png",
              "sameAs": [
                "https://veltrixbooks.com/contact"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "url": "https://veltrixbooks.com/contact"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ViewportHeightAdjuster />
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
