import { exportSearchIndexes } from '@/src/lib/export-search-indexes';

export const revalidate = false;

export const GET = async () => Response.json(await exportSearchIndexes());
