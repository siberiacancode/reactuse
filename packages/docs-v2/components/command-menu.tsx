'use client';
import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { usePathname, useRouter } from 'next/navigation';
import { SortedResult } from 'fumadocs-core/search';
import { Spinner } from './spinner';
import { getCurrentBase, getPagesFromFolder } from '@/lib/page-tree';
import { source } from '@/lib/source';

interface Props {
  tree: typeof source.pageTree;
  navItems: { href: string; label: string }[];
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

  const results = useMemo(() => {
    if (!query.data || !Array.isArray(query.data)) {
      return [];
    }

    return query.data.filter(
      (item, index, self) =>
        !(item.type === 'text' && item.content.trim().split(/\s+/).length <= 1) &&
        index === self.findIndex((t) => t.content === item.content) &&
        item.type === 'page'
    );
  }, [query.data]);

  console.log('query', query);

  const pageGroupsSection = useMemo(() => {
    return tree.children.map((group) => {
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
          heading={group.name}
          className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'
        >
          {pages.map((item) => {
            return (
              <CommandItem
                key={item.url}
                value={item.name?.toString() ? `${group.name} ${item.name}` : ''}
                className='cursor-pointer'
                onSelect={() => handleRedirect(item.url)}
              >
                {item.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      );
    });
  }, [tree.children, currentBase, router]);

  const handleRedirect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  console.log('results', results);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          onClick={() => setOpen(true)}
          className={cn(
            'text-foreground dark:bg-card hover:bg-muted/50 relative h-8 w-full justify-start rounded-lg pl-3 font-normal shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64'
          )}
        >
          <span className='hidden lg:inline-flex'>Search documentation...</span>
          <span className='inline-flex lg:hidden'>Search...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-xl border-none bg-clip-padding p-2 pb-11 ring-4 shadow-2xl ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800'>
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
              heading='Pages'
              className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'
            >
              {navItems.map((item) => (
                <CommandItem
                  className='cursor-pointer'
                  key={item.href}
                  value={`Navigation ${item.label}`}
                  keywords={['nav', 'navigation', item.label.toLowerCase()]}
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
