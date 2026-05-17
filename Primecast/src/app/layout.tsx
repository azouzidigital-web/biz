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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EW0TRWNHDZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-EW0TRWNHDZ');`
          }}
        />
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
        {/* Microsoft Clarity Tracking */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wsnyz84s6s");`
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
