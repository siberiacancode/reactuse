import { functionsSource } from '@docs/lib/source';
import { Button } from '@docs/src/components/ui/button';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { PageLastUpdate } from 'fumadocs-ui/layouts/docs/page';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { FunctionMetadata } from '@/src/constants';

import { LINKS } from '@/src/constants';

import { mdxComponents } from '../../../../mdx-components';
import {
  Toc,
  TocDependencies,
  TocEditLink,
  TocItems,
  TocLink,
  TocList,
  TocScrollToTop,
  TocSeparator,
  TocTitle
} from '../../_components';
import { FunctionHeader } from '../_components/function-header';

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
    title: `${page.data.title} React hook Reactuse`,
    description: page.data.description,
    openGraph: {
      title: `${page.data.title} React hook Reactuse`,
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
      title: `${page.data.title} React hook Reactuse`,
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
      className='scroll-mt-24 pb-8 text-[1.05rem] sm:text-[15px] xl:grid xl:w-full xl:grid-cols-[minmax(0,var(--docs-content-width))_var(--sidebar-width)] xl:items-start xl:gap-[var(--docs-layout-gap)]'
      data-slot='docs'
    >
      <div className='mt-12 min-w-0 flex-col pb-24 xl:flex xl:px-16 2xl:px-22'>
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

        <div className='w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0'>
          <MDX components={mdxComponents} />

          <PageLastUpdate date={new Date(lastModifiedTime)} />

          <div className='mt-2 hidden w-full flex-wrap justify-between gap-2 px-4 sm:flex sm:px-0'>
            {neighbours.previous && (
              <Button
                nativeButton={false}
                render={<Link href={neighbours.previous.url} prefetch={false} />}
                size='sm'
                variant='secondary'
              >
                <ArrowLeftIcon /> {neighbours.previous.name}
              </Button>
            )}
            {neighbours.next && (
              <Button
                nativeButton={false}
                render={<Link href={neighbours.next.url} prefetch={false} />}
                size='sm'
                variant='secondary'
              >
                {neighbours.next.name} <ArrowRightIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className='pointer-events-none sticky top-[calc(var(--header-height)+1px)] z-30 hidden w-(--sidebar-width) flex-col gap-4 self-start pb-8 xl:flex xl:pl-2'>
        {!!doc.toc.length && (
          <div className='no-scrollbar pointer-events-auto max-h-[calc(100svh-var(--header-height)-4rem)] overflow-y-auto overscroll-contain pt-12'>
            <Toc>
              <TocTitle>On this page</TocTitle>
              <TocList>
                <TocItems items={doc.toc} />
                <TocSeparator />
                <TocEditLink
                  href={`${LINKS.DOCS_REPOSITORY}/content/functions/${doc.type}s/${doc.title}.mdx`}
                />
                <TocLink
                  href={`${LINKS.CORE_REPOSITORY}/${doc.type}s/${doc.title}/${doc.title}.demo.tsx`}
                >
                  Watch demo
                </TocLink>
                <TocLink
                  href={`${LINKS.CORE_REPOSITORY}/${doc.type}s/${doc.title}/${doc.title}.ts`}
                >
                  <div className='flex items-center gap-2'>Source</div>
                </TocLink>
                <TocScrollToTop />
              </TocList>
              <TocDependencies hooks={metadata.dependencies.hooks} />
            </Toc>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionPage;
