'use client'

import { useDebounceValue, useField } from '@siberiacancode/reactuse';
import { SearchIcon, StarIcon } from 'lucide-react';
import { useMemo } from 'react';

const BOOKS = [
  { cover: 'PP', title: 'The Pragmatic Programmer', author: 'David Thomas', year: 1999, rating: 4.6 },
  { cover: 'CC', title: 'Clean Code', author: 'Robert Martin', year: 2008, rating: 4.3 },
  {
    cover: 'RU',
    title: 'Reactuse first release',
    author: 'siberiacancode',
    year: 2026,
    rating: 4.9,
    href: 'https://reactuse.com'
  },
  { cover: 'DP', title: 'Design Patterns', author: 'Gang of Four', year: 1994, rating: 4.4 },
  { cover: 'JS', title: "You Don't Know JS", author: 'Kyle Simpson', year: 2014, rating: 4.7 },
  { cover: 'EJ', title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', year: 2018, rating: 4.4 },
  { cover: 'GP', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', year: 2008, rating: 4.1 },
  { cover: 'DD', title: 'Domain-Driven Design', author: 'Eric Evans', year: 2003, rating: 4.2 }
];

const Demo = () => {
  const searchField = useField('');
  const search = searchField.watch();

  const debouncedSearch = useDebounceValue(search, 500);

  const results = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return BOOKS;
    return BOOKS.filter(
      (book) =>
        book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
    );
  }, [debouncedSearch]);

  return (
    <section className='flex w-full max-w-lg flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h3>Your library</h3>
        <p className='text-muted-foreground text-sm'>
          Browse and search across your collection - results settle in shortly after you stop
          typing.
        </p>
      </div>

      <div className='relative w-full md:max-w-xs'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <input
          className='rounded-full! pl-9!'
          placeholder='Search by book info'
          type='text'
          {...searchField.register()}
        />
      </div>

      <div className='no-scrollbar grid max-h-72 grid-cols-1 gap-2 overflow-y-auto md:max-h-none md:grid-cols-2 md:overflow-visible'>
        {!results.length && (
          <p className='text-muted-foreground col-span-full py-6 text-center text-sm'>
            No books match
          </p>
        )}

        {results.map((book) => {
          const Component = book.href ? 'a' : 'div';
          return (
            <Component
              key={book.title}
              className='bg-muted/40 hover:bg-muted/70 flex items-center gap-3 rounded-lg p-3 transition-colors'
              {...(book.href && {
                href: book.href,
                rel: 'noreferrer',
                target: '_blank'
              })}
            >
              <span className='bg-background text-muted-foreground flex size-10 items-center justify-center rounded-full text-[11px] font-semibold leading-none'>
                {book.cover}
              </span>

              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='truncate text-sm font-medium'>{book.title}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {book.author} - {book.year}
                </span>
              </div>

              <span className='text-muted-foreground flex shrink-0 items-center gap-0.5 text-xs'>
                <StarIcon className='size-3 fill-current' />
                {book.rating}
              </span>
            </Component>
          );
        })}
      </div>
    </section>
  );
};

export default Demo;
