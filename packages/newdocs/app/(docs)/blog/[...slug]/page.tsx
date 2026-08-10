import { blogSource } from '@docs/lib/source';
import { mdxComponents } from '@docs/mdx-components';
import { Button } from '@docs/src/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import process from 'node:process';

import { LINKS } from '@/src/constants';
import { formatDate } from '@/src/utils/helpers';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  PageHeaderTopBar,
  Toc,
  TocEditLink,
  TocItems,
  TocList,
  TocScrollToTop,
  TocSeparator,
  TocTitle
} from '../../_components';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = () => blogSource.generateParams();

interface BlogPageProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async (props: BlogPageProps) => {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

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

export const BlogPage = async (props: BlogPageProps) => {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

  if (!page) notFound();

  const doc = page.data;
  const raw = await doc.getText('raw');
  const MDX = doc.body;

  return (
    <div
      className='scroll-mt-24 pb-8 xl:grid xl:w-full xl:grid-cols-[minmax(0,var(--docs-content-width))_var(--sidebar-width)] xl:items-start xl:gap-[var(--docs-layout-gap)]'
      data-slot='blog'
    >
      <div className='mx-auto mt-12 w-full max-w-3xl pb-24'>
        <div className='mb-8 flex flex-col gap-3'>
          <PageHeader>
            <PageHeaderTopBar>
              <PageHeaderTitle>{doc.title}</PageHeaderTitle>
              <PageHeaderActions
                markdown={raw}
                markdownPath={`blog/${page.data.info.path.replace('.mdx', '.md')}`}
              />
            </PageHeaderTopBar>
            {doc.description && <PageHeaderDescription>{doc.description}</PageHeaderDescription>}
          </PageHeader>

          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            {formatDate(doc.date) && <span>{formatDate(doc.date)}</span>}
          </div>
        </div>

        <div className='w-full flex-1 *:data-[slot=alert]:first:mt-0'>
          <MDX components={mdxComponents} />
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
                  href={`${LINKS.DOCS_REPOSITORY}/content/blog/${page.data.info.path}`}
                />
                <TocScrollToTop />
              </TocList>
            </Toc>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
