'use client';

import type { source } from '@docs/lib/source';

import { useDisclosure } from '@siberiacancode/reactuse';
import { liteClient } from 'algoliasearch/lite';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { ArrowRightIcon, CircleDashedIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui';
import { CONFIG } from '@/src/constants';
import { cn } from '@/src/lib';

const client = liteClient(CONFIG.ALGOLIA.APP_ID, CONFIG.ALGOLIA.API_KEY);

interface Props {
  tree: typeof source.pageTree.children;
}

export const Search = (props: Props) => {
  const dialog = useDisclosure();
  const router = useRouter();
  const { setSearch, query } = useDocsSearch({
    type: 'algolia',
    client,
    indexName: CONFIG.ALGOLIA.INDEX_NAME,
    locale: 'en'
  });

  return (
    <Dialog open={dialog.opened} onOpenChange={dialog.toggle}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'dark:bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 border-input bg-muted/40 relative h-8 justify-start rounded-lg border px-2.5 font-normal shadow-none md:w-42 lg:w-62'
          )}
          variant='outline'
          onClick={dialog.toggle}
        >
          <span className='truncate text-sm'>Search docs...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command className='**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border'>
          <div className='relative'>
            <CommandInput placeholder='Search documentation...' onValueChange={setSearch} />
            {query.isLoading && (
              <div className='pointer-events-none absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center justify-center'>
                <Loader2Icon className='text-muted-foreground size-4 animate-spin' />
              </div>
            )}
          </div>
          <CommandList className='no-scrollbar mt-5 max-h-80 min-h-80 scroll-pt-2 scroll-pb-1.5'>
            <CommandEmpty className='text-muted-foreground py-12 text-center text-sm'>
              {query.isLoading ? 'Searching...' : 'No results found.'}
            </CommandEmpty>
            {props.tree.map((group) => {
              if (group.type !== 'folder') return null;
              const isFunction = group.$id === 'helpers' || group.$id === 'hooks';

              return (
                <CommandGroup
                  key={group.$id}
                  className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'
                  heading={group.name}
                >
                  {group.children
                    .filter((child) => child.type === 'page')
                    .map((item) => (
                      <CommandItem
                        asChild
                        key={item.url}
                        className='cursor-pointer'
                        value={item.name!.toString()}
                      >
                        <div>
                          {!isFunction && <ArrowRightIcon />}
                          {isFunction && <CircleDashedIcon />}
                          <Link href={item.url}>{item.name!.toString()}</Link>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              );
            })}

            <CommandGroup className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'>
              {Array.isArray(query.data) &&
                query.data.map((item) => (
                  <CommandItem
                    key={item.id}
                    className='cursor-pointer'
                    keywords={['nav', 'navigation', item.content.toLowerCase()]}
                    value={`Navigation ${item.content}`}
                    onSelect={() => router.push(item.url)}
                  >
                    {item.content}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
