import type { DocumentRecord } from 'fumadocs-core/search/algolia';

import { algoliasearch } from 'algoliasearch';
import { sync } from 'fumadocs-core/search/algolia';
import * as fs from 'node:fs';

import { CONFIG } from '@/src/constants';

const filePath = '.next/server/app/static.json.body';
const content = fs.readFileSync(filePath);
const records = JSON.parse(content.toString()) as DocumentRecord[];
const client = algoliasearch(CONFIG.ALGOLIA.APP_ID, CONFIG.ALGOLIA.API_KEY);

void sync(client, {
  indexName: CONFIG.ALGOLIA.INDEX_NAME,
  documents: records
});
