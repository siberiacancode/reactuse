import { source } from '@docs/lib/source';
import { mdxComponents } from '@docs/mdx-components';
import { Button } from '@docs/ui/button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { findNeighbour } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { DocHeader } from '../_components/doc-header';
import { DocsToc } from '../_components/docs-toc';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async (props: { params: Promise<{ slug: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const doc = page.data;

  if (!doc.title || !doc.description) notFound();

  return {
    title: doc.title,
    description: doc.description,
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`
        }
      ]
    }
  };
};

export const Page = async (props: { params: Promise<{ slug: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) redirect('/docs/introduction');

  const doc = page.data;
  const MDX = doc.body;
  const isChangelog = params.slug?.[0] === 'changelog';
  const neighbours = isChangelog
    ? { previous: null, next: null }
    : findNeighbour(source.pageTree, page.url);
  const raw = await page.data.getText('raw');
  const slug = params.slug ?? ['introduction'];

  return (
    <div
      className='flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full'
      data-slot='docs'
    >
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto mb-6 flex w-full max-w-[45rem] min-w-0 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300'>
          <DocHeader
            description={doc.description}
            markdown={raw}
            next={neighbours.next?.url}
            previous={neighbours.previous?.url}
            slug={slug}
            title={doc.title}
          />
        </div>
        <div className='mx-auto w-full max-w-[45rem] flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0'>
          <MDX components={mdxComponents} />
          <div className='hidden h-16 w-full items-center gap-2 px-4 sm:flex sm:px-0'>
            {neighbours.previous && (
              <Button asChild className='shadow-none' size='sm' variant='secondary'>
                <Link href={neighbours.previous.url}>
                  <IconArrowLeft /> {neighbours.previous.name}
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button asChild className='ml-auto shadow-none' size='sm' variant='secondary'>
                <Link href={neighbours.next.url}>
                  {neighbours.next.name} <IconArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex'>
        {!!doc.toc.length && (
          <div className='no-scrollbar flex flex-col gap-8 overflow-y-auto px-8'>
            <DocsToc items={doc.toc} path={page.data.info.path} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
