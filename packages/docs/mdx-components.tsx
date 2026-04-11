import { CodeBlockCommand } from '@docs/components/code-block-command';
import { CopyButton } from '@docs/components/copy-button';
import { getIconForLanguageExtension } from '@docs/components/icons';
import { cn } from '@docs/lib/utils';
import { Badge } from '@docs/ui/badge';
import { Kbd } from '@docs/ui/kbd';
import { Separator } from '@docs/ui/separator';
import Link from 'next/link';
import * as React from 'react';

import { Callout } from './components/callout';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from './ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';

export const mdxComponents = {
  h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={cn('font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
    <h2
      className={cn(
        'font-heading [&+]*:[code]:text-xl mt-8 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-8 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4',
        className
      )}
      id={props.children
        ?.toString()
        .replace(/ /g, '-')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .toLowerCase()}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4 *:[code]:text-xl',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
    <h4
      className={cn(
        'font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
    <h5
      className={cn('mt-8 scroll-m-28 text-base font-medium tracking-tight', className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
    <h6
      className={cn('mt-8 scroll-m-28 text-base font-medium tracking-tight', className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<'a'>) => (
    <a className={cn('font-medium underline underline-offset-4', className)} {...props} />
  ),
  p: ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p className={cn('leading-relaxed [&:not(:first-child)]:mt-6', className)} {...props} />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-medium', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<'li'>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<'img'>) => (
    <img alt={alt} className={cn('rounded-md', className)} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<'hr'>) => <hr className='my-4 md:my-8' {...props} />,
  table: ({ className, ...props }: React.ComponentProps<'table'>) => {
    <div className='no-scrollbar my-6 w-full overflow-y-auto rounded-xl border'>
      <table
        className={cn(
          'relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0',
          className
        )}
        {...props}
      />
    </div>;
  },
  tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
    <tr className={cn('m-0 border-b', className)} {...props} />
  ),
  th: ({ className, ...props }: React.ComponentProps<'th'>) => (
    <th
      className={cn(
        'px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<'td'>) => (
    <td
      className={cn(
        'px-4 py-2 text-left whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<'pre'>) => (
    <pre
      className={cn(
        'no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0',
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  figure: ({ className, ...props }: React.ComponentProps<'figure'>) => (
    <figure className={cn(className)} {...props} />
  ),
  figcaption: ({ className, children, ...props }: React.ComponentProps<'figcaption'>) => {
    const iconExtension =
      'data-language' in props && typeof props['data-language'] === 'string'
        ? getIconForLanguageExtension(props['data-language'])
        : null;

    return (
      <figcaption
        className={cn(
          'text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70',
          className
        )}
        {...props}
      >
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    ...props
  }: React.ComponentProps<'code'> & {
    __raw__?: string;
    __src__?: string;
    __npm__?: string;
    __yarn__?: string;
    __pnpm__?: string;
    __bun__?: string;
  }) => {
    // Inline Code.
    if (typeof props.children === 'string') {
      return (
        <code
          className={cn(
            'bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none',
            className
          )}
          {...props}
        />
      );
    }

    // npm command.
    const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __bun__={__bun__}
          __npm__={__npm__}
          __pnpm__={__pnpm__}
          __yarn__={__yarn__}
        />
      );
    }

    return (
      <>
        {__raw__ && <CopyButton src={__src__} value={__raw__} />}
        <code {...props} />
      </>
    );
  },
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link className={cn('font-medium underline underline-offset-4', className)} {...props} />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        'bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center rounded-xl p-6 transition-colors sm:p-10',
        className
      )}
      {...props}
    />
  ),
  Kbd,
  Callout,
  Badge,
  Separator,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarGroupCount
};
