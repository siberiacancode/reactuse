import process from 'node:process';

import { functionsSource, source } from '@/lib/source';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const dynamic = 'force-static';

export default function sitemap() {
  const pages = [
    {
      url: new URL('/', baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: 1
    },
    ...source.getPages().map((page) => ({
      url: new URL(page.url, baseUrl).toString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    })),
    ...functionsSource.getPages().map((page) => ({
      url: new URL(page.url, baseUrl).toString(),
      lastModified: new Date(page.data.lastModifiedTime),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  ];

  return Array.from(new Map(pages.map((page) => [page.url, page])).values());
}
