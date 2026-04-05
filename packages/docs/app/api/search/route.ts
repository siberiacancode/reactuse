import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@docs/lib/source';

export const { GET } = createFromSource(source);
