import type { NextConfig } from 'next';

import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ]
  }
};

const withMDX = createMDX();

export default withMDX(nextConfig);
