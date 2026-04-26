import type { ComponentProps } from 'react';

import { LinkIcon } from 'lucide-react';

import { cn } from '@/src/lib/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_STYLES = {
  1: 'font-heading mt-2 mb-2 scroll-m-28 text-3xl font-bold tracking-tight',
  2: 'font-heading [&+]*:[code]:text-xl mt-8 mb-2 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-8 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4',
  3: 'font-heading mt-5 mb-2 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4 *:[code]:text-xl',
  4: 'font-heading mt-4 mb-2 scroll-m-28 text-base font-medium tracking-tight',
  5: 'font-heading mt-4 mb-2 scroll-m-28 text-base font-medium tracking-tight',
  6: 'font-heading mt-4 mb-2 scroll-m-28 text-base font-medium tracking-tight'
};

type HeadingProps<Level extends HeadingLevel = HeadingLevel> = {
  children: string;
  level: HeadingLevel;
} & ComponentProps<`h${Level}`>;

export const Heading = <Level extends HeadingLevel>({
  level,
  className,
  children,
  ...props
}: HeadingProps<Level>) => {
  const id = props.id ?? children.toLowerCase().replace(/ /g, '-');
  const Tag = `h${level}`;

  return (
    <Tag className={cn('group', HEADING_STYLES[level], className)} id={id} {...props}>
      <a className='flex items-center gap-2' href={`#${id}`}>
        {children}
        <LinkIcon className='text-muted-foreground invisible size-4 group-hover:visible' />
      </a>
    </Tag>
  );
};

export const HEAD_COMPONENTS = {
  h1: (props: Omit<HeadingProps<1>, 'level'>) => <Heading level={1} {...props} />,
  h2: (props: Omit<HeadingProps<2>, 'level'>) => <Heading level={2} {...props} />,
  h3: (props: Omit<HeadingProps<3>, 'level'>) => <Heading level={3} {...props} />,
  h4: (props: Omit<HeadingProps<4>, 'level'>) => <Heading level={4} {...props} />,
  h5: (props: Omit<HeadingProps<5>, 'level'>) => <Heading level={5} {...props} />,
  h6: (props: Omit<HeadingProps<6>, 'level'>) => <Heading level={6} {...props} />
};
