import type {NextConfig} from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = bundleAnalyzer({
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true, // Always unoptimized for Netlify static export
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  experimental: {
    optimizeCss: true
  },
  // Enabling static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Redirect all Netlify subdomain traffic to main domain
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'primecast.netlify.app',
          },
        ],
        destination: 'https://primecastt.site/:path*',
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
