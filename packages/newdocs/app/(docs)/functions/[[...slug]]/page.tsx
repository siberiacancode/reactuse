import { functionsSource } from '@docs/lib/source';
import { Button } from '@docs/ui/button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { PageLastUpdate } from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { FunctionMetadata } from '@/src/constants';

import { mdxComponents } from '../../../../mdx-components';
import { FunctionHeader } from '../_components/function-header';
import { FunctionToc } from '../_components/function-toc';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = async () => functionsSource.generateParams();

interface FunctionPageProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async (props: FunctionPageProps) => {
  const params = await props.params;
  const page = functionsSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
};

const FunctionPage = async (props: FunctionPageProps) => {
  const params = await props.params;
  const page = functionsSource.getPage(params.slug);

  if (!page) notFound();

  const doc = page.data;
  const neighbours = findNeighbour(functionsSource.pageTree, page.url);
  const raw = await doc.getText('raw');
  const lastModifiedTime = doc.lastModifiedTime;

  const metadata = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'content', 'functions', `${doc.type}s`, `${doc.title}.meta.json`),
      'utf-8'
    )
  ) as FunctionMetadata;

  const MDX = doc.body;

  return (
    <div
      className='flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full'
      data-slot='docs'
    >
      <div className='mx-auto flex max-w-[50rem] min-w-0 flex-1 flex-col'>
        <div className='mb-6 flex w-full min-w-0 flex-col gap-6 text-neutral-800 md:px-0 dark:text-neutral-300'>
          <FunctionHeader
            category={doc.category}
            description={doc.description}
            isTest={doc.isTest}
            markdown={raw}
            name={doc.title}
            next={neighbours.next?.url}
            previous={neighbours.previous?.url}
            type={doc.type}
            usage={doc.usage}
          />
        </div>

        <div className='mx-auto mt-12 w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0'>
          <MDX components={mdxComponents} />

          <PageLastUpdate date={new Date(lastModifiedTime)} />

          <div className='mt-2 hidden w-full flex-wrap justify-between gap-2 px-4 sm:flex sm:px-0'>
            {neighbours.previous && (
              <Button asChild size='sm' variant='secondary'>
                <Link href={neighbours.previous.url}>
                  <IconArrowLeft /> {neighbours.previous.name}
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button asChild size='sm' variant='secondary'>
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
          <div className='no-scrollbar flex flex-col gap-8 overflow-y-auto'>
            <FunctionToc
              hooks={metadata.dependencies.hooks}
              items={doc.toc}
              name={doc.title}
              type={doc.type}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionPage;
