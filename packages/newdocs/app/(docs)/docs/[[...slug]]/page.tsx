import { source } from '@docs/lib/source';
import { mdxComponents } from '@docs/mdx-components';
import { Button } from '@docs/src/components/ui/button';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import process from 'node:process';

import { DocsHeader } from '../_components/docs-header';
import { DocsToc } from '../_components/docs-toc';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = () => source.generateParams();

interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async (props: DocsPageProps) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_APP_URL}${page.url}`,
      images: [
        {
          url: `/og${page.url}.png`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [
        {
          url: `/og${page.url}.png`
        }
      ],
      creator: '@siberiacancode'
    }
  };
};

export const DocsPage = async (props: DocsPageProps) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const doc = page.data;
  const neighbours = findNeighbour(source.pageTree, page.url);
  const raw = await doc.getText('raw');

  if (page.path.includes('llms.txt')) notFound();

  const MDX = doc.body;

  return (
    <div
      className='scroll-mt-24 pb-8 text-[1.05rem] sm:text-[15px] xl:grid xl:w-full xl:grid-cols-[minmax(0,var(--docs-content-width))_var(--sidebar-width)] xl:items-start xl:gap-[var(--docs-layout-gap)]'
      data-slot='docs'
    >
      <div className='mt-12 min-w-0 flex-col pb-24 xl:flex xl:px-16 2xl:px-22'>
        <div className='mb-6 flex w-full min-w-0 flex-col gap-6 text-neutral-800 md:px-0 dark:text-neutral-300'>
          <DocsHeader
            description={doc.description}
            markdown={raw}
            next={neighbours.next?.url}
            path={page.data.info.path}
            previous={neighbours.previous?.url}
            title={doc.title}
          />
        </div>
        <div className='w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0'>
          <MDX components={mdxComponents} />
          <div className='hidden h-16 w-full items-center gap-2 px-4 sm:flex sm:px-0'>
            {neighbours.previous && (
              <Button asChild className='shadow-none' size='sm' variant='secondary'>
                <Link href={neighbours.previous.url}>
                  <ArrowLeftIcon /> {neighbours.previous.name}
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button asChild className='ml-auto shadow-none' size='sm' variant='secondary'>
                <Link href={neighbours.next.url}>
                  {neighbours.next.name} <ArrowRightIcon />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='pointer-events-none sticky top-[calc(var(--header-height)+1px)] z-30 hidden w-(--sidebar-width) flex-col gap-4 self-start pb-8 xl:flex xl:pl-2'>
        {!!doc.toc.length && (
          <div className='no-scrollbar pointer-events-auto max-h-[calc(100svh-var(--header-height)-4rem)] overflow-y-auto overscroll-contain pt-12'>
            <DocsToc items={doc.toc} path={page.data.info.path} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsPage;
