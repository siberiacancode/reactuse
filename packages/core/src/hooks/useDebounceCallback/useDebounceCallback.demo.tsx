import type { ChangeEvent } from 'react';

import { useDebounceCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

const ANIMALS = [
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🦀', name: 'Crab' },
  { emoji: '🐠', name: 'Fish' },
  { emoji: '🐧', name: 'Penguin' },
  { emoji: '🦅', name: 'Eagle' },
  { emoji: '🦆', name: 'Duck' }
];

const searchAnimals = (query: string): Promise<typeof ANIMALS> =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          ANIMALS.filter((animal) => animal.name.toLowerCase().includes(query.toLowerCase()))
        ),
      300
    );
  });

const Demo = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(ANIMALS);
  const debouncedSearch = useDebounceCallback(async (query: string) => {
    const searchResults = await searchAnimals(query);
    setResults(searchResults);
    setIsLoading(false);
  }, 500);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const value = event.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <>
      <div className='flex flex-col gap-1'>
        <label>Search animals</label>
        <input
          className='w-full'
          type='text'
          value={search}
          onChange={onSearch}
          placeholder='Type to search animals...'
        />
      </div>

      <div className='mt-4'>
        {isLoading && <div className='py-1 text-sm'>Loading...</div>}
        {results.map((animal, index) => (
          <div key={index} className='flex items-center py-1'>
            <span className='mr-3 text-lg'>{animal.emoji}</span>
            <span className='text-sm'>{animal.name}</span>
          </div>
        ))}
      </div>

      {!results.length && !isLoading && <div className='text-sm'>No animals found</div>}
    </>
  );
};

export default Demo;
