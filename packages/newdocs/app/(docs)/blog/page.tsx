import { blogSource } from '@docs/lib/source';
import { RssIcon } from 'lucide-react';
import Link from 'next/link';
import process from 'node:process';

import { Button } from '@/src/components/ui';
import { getOgImageUrl } from '@/src/utils/helpers';

export const revalidate = false;
export const dynamic = 'force-static';

export const metadata = {
  title: 'Blog',
  description: 'News, guides and updates about reactuse.',
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: 'reactuse blog',
          url: '/blog/rss.xml'
        }
      ]
    }
  },
  openGraph: {
    title: 'Blog',
    description: 'News, guides and updates about reactuse.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL}blog`,
    images: [
      {
        url: getOgImageUrl('/blog')
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'News, guides and updates about reactuse.',
    images: [
      {
        url: getOgImageUrl('/blog')
      }
    ],
    creator: '@siberiacancode'
  }
};

const formatDate = (date?: string) => {
  if (!date) return null;
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return date;
  }
};

const formatTitle = (title: string, date?: string) => {
  const formatted = formatDate(date);
  return formatted ? `${formatted} - ${title}` : title;
};

const BlogListPage = () => {
  const posts = [...blogSource.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const mainPosts = posts.slice(0, 10);
  const morePosts = posts.slice(10);

  return (
    <div
      className='scroll-mt-24 pb-8 xl:grid xl:w-full xl:grid-cols-[minmax(0,var(--docs-content-width))_var(--sidebar-width)] xl:items-start xl:gap-[var(--docs-layout-gap)]'
      data-slot='blog'
    >
      <div className='mx-auto mt-12 w-full max-w-3xl pb-24'>
        <div className='mb-10 flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-foreground text-3xl font-semibold tracking-tight'>Blog</h1>
            <p className='text-muted-foreground text-base'>
              News, guides and updates about reactuse.
            </p>
          </div>

          <Button
            className='shrink-0 rounded-full'
            nativeButton={false}
            render={<a href='/blog/rss.xml' rel='noreferrer' target='_blank' />}
            size='sm'
            variant='secondary'
          >
            <RssIcon className='size-3.5' /> RSS
          </Button>
        </div>

        <div className='flex flex-col'>
          {mainPosts.map((post) => (
            <Link
              key={post.url}
              className='group hover:bg-muted/40 -mx-3 flex flex-col gap-1 rounded-lg px-3 py-4 transition-colors'
              href={post.url}
              prefetch={false}
            >
              <span className='text-foreground text-lg font-medium tracking-tight'>
                {formatTitle(post.data.title, post.data.date)}
              </span>
              {post.data.description && (
                <p className='text-muted-foreground line-clamp-2 text-sm'>
                  {post.data.description}
                </p>
              )}
            </Link>
          ))}

          {!posts.length && (
            <p className='text-muted-foreground text-sm'>No posts yet. Stay tuned!</p>
          )}
        </div>

        {!!morePosts.length && (
          <div className='mt-16 scroll-mt-24' id='more-updates'>
            <h2 className='text-foreground mb-6 text-xl font-semibold tracking-tight'>
              More Updates
            </h2>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {morePosts.map((post) => (
                <Link
                  key={post.url}
                  className='group border-border/60 hover:bg-muted/40 flex flex-col gap-1 rounded-xl border p-4 transition-colors'
                  href={post.url}
                  prefetch={false}
                >
                  <span className='text-foreground text-sm font-medium tracking-tight'>
                    {formatTitle(post.data.title, post.data.date)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='pointer-events-none sticky top-[calc(var(--header-height)+1px)] z-30 hidden w-(--sidebar-width) flex-col gap-4 self-start pb-8 xl:flex xl:pl-2'>
        {!!mainPosts.length && (
          <nav className='no-scrollbar pointer-events-auto max-h-[calc(100svh-var(--header-height)-4rem)] overflow-y-auto overscroll-contain pt-12'>
            <p className='text-md text-foreground mb-2 font-semibold'>On This Page</p>
            <ul className='flex flex-col gap-2 text-sm'>
              {mainPosts.map((post) => (
                <li key={post.url}>
                  <Link
                    className='text-muted-foreground hover:text-foreground text-md no-underline transition-colors'
                    href={post.url}
                    prefetch={false}
                  >
                    {formatTitle(post.data.title, post.data.date)}
                  </Link>
                </li>
              ))}

              {!!morePosts.length && (
                <li>
                  <a
                    className='text-muted-foreground hover:text-foreground text-md no-underline transition-colors'
                    href='#more-updates'
                  >
                    More Updates
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
