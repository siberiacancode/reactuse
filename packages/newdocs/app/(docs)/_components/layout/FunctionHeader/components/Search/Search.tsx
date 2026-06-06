'use client';

import type { source } from '@docs/lib/source';

import { useDisclosure } from '@siberiacancode/reactuse';
import { liteClient } from 'algoliasearch/lite';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { ArrowRightIcon, CircleDashedIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';

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
          onClick={() => dialog.toggle()}
        >
          <span className='truncate text-sm'>Search docs...</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='rounded-xl border-none bg-clip-padding px-2 py-3 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800'
        showCloseButton={false}
      >
        <DialogHeader className='sr-only'>
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command>
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
                      <Link key={item.url} className='block' href={item.url} onClick={dialog.close}>
                        <CommandItem className='cursor-pointer' value={item.name!.toString()}>
                          <div className='flex items-center justify-center gap-2'>
                            {!isFunction && <ArrowRightIcon />}
                            {isFunction && <CircleDashedIcon />}
                            <span>{item.name!.toString()}</span>
                          </div>
                        </CommandItem>
                      </Link>
                    ))}
                </CommandGroup>
              );
            })}

            <CommandGroup className='!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1'>
              {Array.isArray(query.data) &&
                query.data.map((item) => (
                  <Link key={item.id} className='block' href={item.url} onClick={dialog.close}>
                    <CommandItem
                      className='cursor-pointer'
                      keywords={['nav', 'navigation', item.content.toLowerCase()]}
                      value={`Navigation ${item.content}`}
                    >
                      {item.content}
                    </CommandItem>
                  </Link>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
