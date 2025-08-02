import { type NextConfig } from 'next/types';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { createSecureHeaders } from 'next-secure-headers';
import path from 'path';

import { MonitoringProvider } from '@workspace/monitoring/src/provider';

const INTERNAL_PACKAGES = [
  '@workspace/api-keys',
  '@workspace/auth',
  '@workspace/billing',
  '@workspace/common',
  '@workspace/database',
  '@workspace/email',
  '@workspace/monitoring',
  '@workspace/rate-limit',
  '@workspace/routes',
  '@workspace/ui',
  '@workspace/webhooks'
];

const nextConfig: NextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: INTERNAL_PACKAGES,
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: [
      'recharts',
      'lucide-react',
      'date-fns',
      ...INTERNAL_PACKAGES
    ]
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        locale: false,
        source: '/(.*)',
        headers: createSecureHeaders({
          frameGuard: 'deny',
          noopen: 'noopen',
          nosniff: 'nosniff',
          xssProtection: 'sanitize',
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true }
          ],
          referrerPolicy: 'same-origin'
        })
      }
    ];
  },
  async redirects() {
    return [
      { source: '/', destination: '/auth', permanent: false },
      { source: '/auth', destination: '/auth/sign-in', permanent: false },
      {
        source: '/organizations/:slug/settings',
        destination: '/organizations/:slug/settings/account',
        permanent: false
      },
      {
        source: '/organizations/:slug/settings/account',
        destination: '/organizations/:slug/settings/account/profile',
        permanent: false
      },
      {
        source: '/organizations/:slug/settings/organization',
        destination: '/organizations/:slug/settings/organization/general',
        permanent: false
      }
    ];
  },

  /** ✅ Webpack alias fallback for Vercel production builds */
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@workspace/database': path.resolve(__dirname, '../../packages/database/src'),
      '@workspace/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@workspace/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@workspace/common': path.resolve(__dirname, '../../packages/common/src'),
      '@workspace/monitoring': path.resolve(__dirname, '../../packages/monitoring/src')
    };
    return config;
  }
};

const bundleAnalyzerConfig =
  process.env.ANALYZE === 'true'
    ? withBundleAnalyzer({ enabled: true })(nextConfig)
    : nextConfig;

export default MonitoringProvider.withConfig(bundleAnalyzerConfig);
