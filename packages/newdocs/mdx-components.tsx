// import { CodeBlockCommand } from '@docs/components/code-block-command';
import { CopyButton } from '@docs/components/copy-button';
import { getIconForLanguageExtension } from '@docs/components/icons';
import { cn } from '@docs/lib/utils';
import { Badge } from '@docs/ui/badge';
import { Kbd } from '@docs/ui/kbd';
import { Separator } from '@docs/ui/separator';
import { Step, Steps } from '@docs/ui/steps';
import Link from 'next/link';
import * as React from 'react';

import { FunctionApi } from './app/functions/_components/function-api';
import { FunctionBanner } from './app/functions/_components/function-banner';
import { FunctionCode } from './app/functions/_components/function-code';
import { FunctionContributors } from './app/functions/_components/function-contributors';
import { FunctionDemo } from './app/functions/_components/function-demo';
import { FunctionTabs } from './app/functions/_components/function-tabs';
import { Callout } from './components/callout';
import { MARKDOWN_COMPONENTS } from './src/components';
import { PackageManagerTab, PackageManagerTabs } from './src/components/code-block-command';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const CUSTOM_COMPONENTS = {
  FunctionCode,
  FunctionTabs,
  FunctionDemo,
  FunctionBanner,
  FunctionApi,
  FunctionContributors,
  PackageManagerTabs,
  PackageManagerTab,
  Steps,
  Step
};

export const mdxComponents = {
  ...MARKDOWN_COMPONENTS,
  ...CUSTOM_COMPONENTS,
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
  code: (props: React.ComponentProps<'code'>) => (
    <>
      {props.__copy__ === 'copy' && <CopyButton src={props.__src__} value={props.__raw__} />}
      <code {...props} />
    </>
  ),
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
