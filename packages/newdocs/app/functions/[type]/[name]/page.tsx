import { DocsCopyPage } from '@docs/components/docs-copy-page';
import { DocsTableOfContents } from '@docs/components/docs-toc';
import { functionsSource } from '@docs/lib/source';
import { mdxComponents } from '@docs/mdx-components';
import { Button } from '@docs/ui/button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { findNeighbour } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return functionsSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ name: string; type: string }> }) {
  const params = await props.params;
  const page = functionsSource.getPage([params.type, params.name]);

  if (!page) {
    notFound();
  }

  const doc = page.data;

  if (!doc.title || !doc.description) {
    notFound();
  }

  return {
    title: doc.title,
    description: doc.description
  };
}

export default async function Page(props: { params: Promise<{ name: string; type: string }> }) {
  const params = await props.params;
  const page = functionsSource.getPage([params.type, params.name]);

  if (!page) {
    notFound();
  }

  const doc = page.data;
  const MDX = doc.body;
  const neighbours = findNeighbour(functionsSource.pageTree, page.url);
  const raw = await doc.getText('raw');

  return (
    <div
      className='flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full'
      data-slot='docs'
    >
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='h-(--top-spacing) shrink-0' />
        <div className='mx-auto flex w-full max-w-[45rem] min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between md:items-start'>
                <h1 className='scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl'>
                  {doc.title}
                </h1>
                <div className='docs-nav flex items-center gap-2'>
                  <div className='hidden sm:block'>
                    <DocsCopyPage page={raw} />
                  </div>
                  <div className='ml-auto flex gap-2'>
                    {neighbours.previous && (
                      <Button
                        asChild
                        className='extend-touch-target size-8 shadow-none md:size-7'
                        size='icon'
                        variant='secondary'
                      >
                        <Link href={neighbours.previous.url}>
                          <IconArrowLeft />
                          <span className='sr-only'>Previous</span>
                        </Link>
                      </Button>
                    )}
                    {neighbours.next && (
                      <Button
                        asChild
                        className='extend-touch-target size-8 shadow-none md:size-7'
                        size='icon'
                        variant='secondary'
                      >
                        <Link href={neighbours.next.url}>
                          <span className='sr-only'>Next</span>
                          <IconArrowRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {doc.description && (
                <p className='text-muted-foreground text-[1.05rem] sm:text-base sm:text-balance md:max-w-[90%]'>
                  {doc.description}
                </p>
              )}
            </div>
          </div>
          <div className='w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0'>
            <MDX components={mdxComponents} />
          </div>
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
        <div className='h-(--top-spacing) shrink-0' />
        {doc.toc?.length && (
          <div className='no-scrollbar flex flex-col gap-8 overflow-y-auto px-8'>
            <DocsTableOfContents toc={doc.toc} />
          </div>
        )}
      </div>
    </div>
  );
}
