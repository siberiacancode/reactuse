import type { DocumentRecord } from 'fumadocs-core/search/algolia';

import { source } from '@/lib/source';

export async function exportSearchIndexes() {
  const results: DocumentRecord[] = [];
  for (const page of source.getPages()) {
    results.push({
      _id: page.url,
      structured: page.data.structuredData,
      url: page.url,
      title: page.data.title,
      description: page.data.description
    });
  }
  return results;
}
