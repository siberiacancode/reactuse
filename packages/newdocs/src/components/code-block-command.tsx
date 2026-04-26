'use client';

import type { ReactNode } from 'react';

import { cn } from '@docs/lib/utils';
import { Button } from '@docs/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/ui/tabs';
import { useCopy, useLocalStorage } from '@siberiacancode/reactuse';
import { IconCheck, IconCopy, IconTerminal } from '@tabler/icons-react';
import { Children, useRef } from 'react';

export const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export interface PackageManagerTabsProps extends React.ComponentProps<'div'> {
  children: ReactNode;
}

export interface PackageManagerTabProps {
  children: ReactNode;
  value: PackageManager;
}

export const PackageManagerTab = ({ children }: PackageManagerTabProps) => <>{children}</>;

export const PackageManagerTabs = ({ children, className }: PackageManagerTabsProps) => {
  const { copy, copied } = useCopy(2000);

  const packageManagerLocalStorage = useLocalStorage<PackageManager>(
    'reactuse-function-package-manager-tabs',
    'pnpm'
  );

  const value = packageManagerLocalStorage.value ?? 'pnpm';

  const contentRef = useRef<HTMLDivElement>(null);

  const childrenArray = Children.toArray(children) as React.ReactElement<PackageManagerTabProps>[];

  const onCopy = () => {
    if (!contentRef.current || !contentRef.current.textContent || copied) return;
    copy(contentRef.current.textContent);
  };

  return (
    <div className={cn('bg-code relative overflow-hidden rounded-lg', className)}>
      <Tabs
        className='gap-0'
        value={value}
        onValueChange={(nextValue) => packageManagerLocalStorage.set(nextValue as PackageManager)}
      >
        <div className='border-border/50 flex items-center gap-2 border-b px-3 py-1'>
          <div className='bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70'>
            <IconTerminal className='text-code size-3' />
          </div>

          <TabsList className='rounded-none bg-transparent p-0'>
            {childrenArray.map((child) => (
              <TabsTrigger
                key={child.props.value}
                className='data-[state=active]:bg-background! data-[state=active]:border-input h-7 border border-transparent pt-0.5 shadow-none!'
                value={child.props.value}
              >
                {child.props.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div ref={contentRef} className='no-scrollbar overflow-x-auto'>
          {childrenArray.map((child) => (
            <TabsContent
              key={child.props.value}
              className='mt-0 [&>figure]:m-0'
              value={child.props.value}
            >
              {child.props.children}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <Button
        className='absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100'
        size='icon'
        variant='ghost'
        onClick={onCopy}
      >
        <span className='sr-only'>Copy</span>
        {copied ? <IconCheck /> : <IconCopy />}
      </Button>
    </div>
  );
};
