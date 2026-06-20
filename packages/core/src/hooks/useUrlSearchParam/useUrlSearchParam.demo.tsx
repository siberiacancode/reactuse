import {
  useDebounceCallback,
  useDisclosure,
  useField,
  useMutation,
  useUrlSearchParam
} from '@siberiacancode/reactuse';
import { Loader2Icon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from 'react';

interface Result {
  description: string;
  title: string;
  url: string;
}

const RESULTS: Result[] = [
  {
    title: 'React',
    description: 'The library for web and native user interfaces.',
    url: 'react.dev'
  },
  {
    title: 'TypeScript',
    description: 'JavaScript with syntax for types. Catches errors early in your editor.',
    url: 'typescriptlang.org'
  },
  {
    title: 'Vite',
    description: 'Next generation frontend tooling. Instant server start and lightning-fast HMR.',
    url: 'vite.dev'
  },
  {
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapidly building custom user interfaces.',
    url: 'tailwindcss.com'
  },
  {
    title: 'Next.js',
    description: "The React framework for the web. Used by some of the world's largest companies.",
    url: 'nextjs.org'
  },
  {
    title: 'Vitest',
    description: 'A blazing fast unit test framework powered by Vite.',
    url: 'vitest.dev'
  },
  {
    title: 'ESLint',
    description: 'Find and fix problems in your JavaScript code.',
    url: 'eslint.org'
  },
  {
    title: 'Prettier',
    description: 'An opinionated code formatter that supports many languages.',
    url: 'prettier.io'
  },
  {
    title: 'Playwright',
    description: 'Reliable end-to-end testing for modern web apps.',
    url: 'playwright.dev'
  },
  {
    title: 'Storybook',
    description: 'Frontend workshop for building UI components and pages in isolation.',
    url: 'storybook.js.org'
  }
];

const searchData = (query: string) =>
  new Promise<Result[]>((resolve) => {
    const count = (query.length % 4) + 2;
    const start = query.length % RESULTS.length;
    const results = Array.from(
      { length: count },
      (_, index) => RESULTS[(start + index) % RESULTS.length]
    );
    setTimeout(resolve, 600, results);
  });

const Demo = () => {
  const searchParam = useUrlSearchParam('q', '');
  const searchField = useField(searchParam.value ?? '');
  const dropdown = useDisclosure();
  const [results, setResults] = useState<Result[]>([]);

  const searchDataMutation = useMutation(searchData);

  const debouncedSearch = useDebounceCallback(async (value: string) => {
    const searchDataResponse = await searchDataMutation.mutateAsync(value);
    setResults(searchDataResponse);
  }, 400);

  const onChange = (value: string) => {
    searchParam.set(value);
    dropdown.open();
    if (value.trim()) {
      debouncedSearch(value);
      return;
    }
    setResults([]);
  };

  const search = searchField.watch();

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-6 text-center'>
      <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
        <SearchIcon className='size-7' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-lg font-semibold'>Find top tools for your app</h3>
        <p className='text-muted-foreground text-sm'>
          Search across the modern frontend stack and discover the right tool for the job.
        </p>
      </div>

      <div className='relative w-full'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2' />
        <input
          className='h-12! w-full rounded-xl! pr-4! pl-11! text-base'
          placeholder='Search tools…'
          type='text'
          {...searchField.register({
            onChange: (event) => onChange(event.target.value)
          })}
        />

        {dropdown.opened &&
          !!search.trim() &&
          (!!results.length || searchDataMutation.isLoading) && (
            <div
              className='absolute top-full right-0 left-0 z-50 mt-2 text-left'
              data-slot='dropdown-menu-content'
            >
              {searchDataMutation.isLoading && (
                <div className='text-muted-foreground flex items-center justify-center gap-2 px-3 py-6 text-sm'>
                  <Loader2Icon className='size-4 animate-spin' />
                  Searching…
                </div>
              )}

              {!searchDataMutation.isLoading &&
                results.map((result) => (
                  <div key={result.title} data-slot='dropdown-menu-item'>
                    <TrendingUpIcon className='text-muted-foreground mt-0.5 size-4 shrink-0 self-start' />
                    <div className='flex min-w-0 flex-1 flex-col'>
                      <div className='flex items-baseline gap-2'>
                        <span className='text-foreground text-sm font-medium'>{result.title}</span>
                        <span className='text-muted-foreground truncate text-xs'>{result.url}</span>
                      </div>
                      <span className='text-muted-foreground truncate text-xs'>
                        {result.description}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
      </div>
    </section>
  );
};

export default Demo;
