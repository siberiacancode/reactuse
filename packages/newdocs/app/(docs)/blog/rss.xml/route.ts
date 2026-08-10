import { getRSS } from '@/src/utils/server';

export const revalidate = false;
export const dynamic = 'force-static';

export const GET = () =>
  new Response(getRSS(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
