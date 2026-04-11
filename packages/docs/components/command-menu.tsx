'use client';
import type { source } from '@docs/lib/source';

import { useDebouncedCallback } from '@docs/hooks/use-debounced-callback';
import { getCurrentBase, getPagesFromFolder } from '@docs/lib/page-tree';
import { cn } from '@docs/lib/utils';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Spinner } from './spinner';

interface Props {
  navItems: { href: string; label: string }[];
  tree: typeof source.pageTree;
}

export const CommandMenu = (props: Props) => {
  const { tree, navItems } = props;

  const router = useRouter();
  const pathname = usePathname();
  const currentBase = getCurrentBase(pathname);
  const [open, setOpen] = useState(false);

  const { setSearch, query } = useDocsSearch({
    type: 'fetch'
  });

  const handleChangeSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 500);

  const handleRedirect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const pageGroupsSection = useMemo(
    () =>
      tree.children.map((group) => {
        if (group.type !== 'folder') {
          return null;
        }

        const pages = getPagesFromFolder(group, currentBase);

        if (pages.length === 0) {
          return null;
        }

        return (
          <CommandGroup
            key={group.$id}
            className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'
            heading={group.name}
          >
            {pages.map((item) => (
              <CommandItem
                key={item.url}
                className='cursor-pointer'
                value={item.name?.toString() ? `${group.name} ${item.name}` : ''}
                onSelect={() => handleRedirect(item.url)}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        );
      }),
    [tree.children, currentBase, router]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'text-foreground dark:bg-card hover:bg-muted/50 relative h-8 w-full justify-start rounded-lg pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64'
          )}
          variant='outline'
          onClick={() => setOpen(true)}
        >
          <span className='hidden lg:inline-flex'>Search documentation...</span>
          <span className='inline-flex lg:hidden'>Search...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command className='**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border'>
          <div className='relative'>
            <CommandInput
              placeholder='Search documentation...'
              onValueChange={handleChangeSearch}
            />
            {query.isLoading && (
              <div className='pointer-events-none absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center justify-center'>
                <Spinner className='text-muted-foreground size-4' />
              </div>
            )}
          </div>
          <CommandList className='no-scrollbar mt-5 max-h-80 min-h-80 scroll-pt-2 scroll-pb-1.5'>
            <CommandEmpty className='text-muted-foreground py-12 text-center text-sm'>
              {query.isLoading ? 'Searching...' : 'No results found.'}
            </CommandEmpty>
            <CommandGroup
              className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'
              heading='Pages'
            >
              {navItems.map((item) => (
                <CommandItem
                  key={item.href}
                  className='cursor-pointer'
                  keywords={['nav', 'navigation', item.label.toLowerCase()]}
                  value={`Navigation ${item.label}`}
                  onSelect={() => handleRedirect(item.href)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {pageGroupsSection}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
