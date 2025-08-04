import withBundleAnalyzer from '@next/bundle-analyzer';
import { createSecureHeaders } from 'next-secure-headers';
import MonitoringProvider from '../../packages/monitoring/src/provider/index.js';

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

// Safe env resolution in ESM context
const env = (globalThis.process && globalThis.process.env) || {};

const nextConfig = {
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

  webpack: (config) => config
};

export default MonitoringProvider.withConfig(
  env.ANALYZE === 'true'
    ? withBundleAnalyzer({ enabled: true })(nextConfig)
    : nextConfig
);
