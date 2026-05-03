import type { NextConfig } from 'next';

import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/new',
  pageExtensions: ['jsx', 'mdx', 'tsx'],
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
  },
  redirects: async () => [
    {
      source: '/docs/llm.txt',
      destination: '/llms.txt',
      permanent: true
    }
  ]
};

const withMDX = createMDX();

export default withMDX(nextConfig);
