import { functionsSource } from '@docs/lib/source';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { notFound } from 'next/navigation';

import { FunctionHeader } from '../../_components/function-header';

export const revalidate = false;
export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = () => functionsSource.generateParams();

interface FunctionPageProps {
  params: Promise<{ name: string; type: string }>;
}

export const generateMetadata = async (props: FunctionPageProps) => {
  const params = await props.params;
  const page = functionsSource.getPage([params.type, params.name]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
};

const FunctionPage = async (props: FunctionPageProps) => {
  const params = await props.params;
  const page = functionsSource.getPage([params.type, params.name]);

  if (!page) notFound();

  const doc = page.data;
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
          <FunctionHeader
            category={doc.category}
            description={doc.description}
            isDemo={doc.isDemo}
            isTest={doc.isTest}
            name={doc.title}
            next={neighbours.next?.url}
            page={raw}
            previous={neighbours.previous?.url}
            type={doc.type}
            usage={doc.usage}
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionPage;
