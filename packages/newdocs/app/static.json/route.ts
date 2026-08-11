import type { DocumentRecord } from 'fumadocs-core/search/algolia';

import { blogSource, functionsSource, source } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = false;

const exportSearchIndexes = async () => {
  const results: DocumentRecord[] = [];

  for (const pageSource of [source, functionsSource, blogSource]) {
    for (const page of pageSource.getPages()) {
      results.push({
        _id: page.url,
        structured: page.data.structuredData,
        url: page.url,
        title: page.data.title,
        description: page.data.description
      });
    }
  }

  return results;
};

export const GET = async () => Response.json(await exportSearchIndexes());
