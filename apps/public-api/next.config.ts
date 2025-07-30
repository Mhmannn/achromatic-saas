import { type NextConfig } from 'next/types';
import withBundleAnalyzer from '@next/bundle-analyzer';

const INTERNAL_PACKAGES = [
  '@workspace/api-keys',
  '@workspace/common',
  '@workspace/database'
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: INTERNAL_PACKAGES
  },
  reactStrictMode: false,
  poweredByHeader: false
};

const bundleAnalyzerConfig =
  process.env.ANALYZE === 'true'
    ? withBundleAnalyzer({ enabled: true })(nextConfig)
    : nextConfig;

export default bundleAnalyzerConfig;
