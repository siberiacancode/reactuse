import { functionsSource, source } from '@docs/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { Buffer } from 'node:buffer';
import process from 'node:process';

import type { PageTreePage, PageTreeRoot } from '@/lib/page-tree';

import { getAllPagesFromFolder } from '@/lib/page-tree';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

interface OgPage {
  description: string;
  slug: string[];
  title: string;
}

const normalizeUrlToSlug = (url: string) =>
  url
    .replace(/^\/|\/$/g, '')
    .split('/')
    .filter(Boolean);

const getAllPagesFromTree = (tree: PageTreeRoot): PageTreePage[] =>
  tree.children.flatMap((child) => {
    if (child.type === 'page') {
      return [child];
    }

    if (child.type === 'folder') {
      return getAllPagesFromFolder(child);
    }

    return [];
  });

export const getOgPages = (): OgPage[] => {
  const docsPages = getAllPagesFromTree(source.getPageTree()).flatMap((node) => {
    const page = source.getNodePage(node);

    if (!page?.data.title || !page.data.description) return [];

    return [
      {
        slug: normalizeUrlToSlug(node.url),
        title: page.data.title,
        description: page.data.description
      }
    ];
  });

  const functionsPages = getAllPagesFromTree(functionsSource.getPageTree()).flatMap((node) => {
    const page = functionsSource.getNodePage(node);

    if (!page?.data.title || !page.data.description) return [];

    return [
      {
        slug: normalizeUrlToSlug(node.url),
        title: page.data.title,
        description: page.data.description
      }
    ];
  });

  return [...docsPages, ...functionsPages];
};

export const getOgPageBySlug = (slug: string[]) => {
  const normalizedSlug = [...slug];
  const lastIndex = normalizedSlug.length - 1;
  const lastSegment = normalizedSlug[lastIndex];

  if (lastSegment?.endsWith('.png')) {
    normalizedSlug[lastIndex] = lastSegment.slice(0, -4);
  }

  const pathname = normalizedSlug.join('/');

  return getOgPages().find((page) => page.slug.join('/') === pathname);
};

export const getOgImageUrl = (pageUrl: string) => `/og${pageUrl}.png`;

export const generateStaticParams = () =>
  getOgPages().map((page) => ({
    slug: [...page.slug.slice(0, -1), `${page.slug[page.slug.length - 1]}.png`]
  }));

const loadAssets = async () => {
  const [normal, semibold] = await Promise.all([
    import('./geist-regular-otf.json').then((mod) => mod.default),
    import('./geist-semibold-otf.json').then((mod) => mod.default)
  ]);

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal.base64Font, 'base64'),
      weight: 400,
      style: 'normal'
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold.base64Font, 'base64'),
      weight: 600,
      style: 'normal'
    }
  ] as const;
};

interface OgRouteProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const GET = async (_request: Request, props: OgRouteProps) => {
  const { slug } = await props.params;

  const page = getOgPageBySlug(slug);

  if (!page) notFound();

  const fonts = await loadAssets();

  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/logo.svg`;

  return new ImageResponse(
    (
      <div
        style={{ fontFamily: 'Geist' }}
        tw='relative flex h-full w-full overflow-hidden bg-black text-white'
      >
        <div tw='relative flex h-full w-full flex-col justify-center px-24'>
          <img
            style={{
              objectFit: 'contain',
              marginTop: -64
            }}
            height={120}
            src={logoUrl}
            width={120}
          />

          <div
            style={{
              textWrap: 'balance',
              fontSize: page.title.length > 28 ? 64 : 80
            }}
            tw='mt-16 max-w-[880px] font-semibold leading-[0.95] tracking-[-0.06em]'
          >
            {page.title}
          </div>

          <div
            style={{
              textWrap: 'balance',
              fontSize: page.description.length > 90 ? 30 : 38
            }}
            tw='mt-8 max-w-[820px] leading-[1.25] text-stone-400'
          >
            {page.description}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts
    }
  );
};
