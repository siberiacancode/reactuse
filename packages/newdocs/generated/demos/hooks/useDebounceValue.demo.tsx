'use client'

import { useDebounceValue, useField } from '@siberiacancode/reactuse';
import { SearchIcon } from 'lucide-react';
import { useMemo } from 'react';

const ANIMALS = [
  { emoji: '🦊', name: 'Red Fox', habitat: 'Forest', region: 'Eurasia' },
  { emoji: '🐼', name: 'Giant Panda', habitat: 'Bamboo forest', region: 'China' },
  { emoji: '🦁', name: 'Lion', habitat: 'Savanna', region: 'Africa' },
  { emoji: '🐧', name: 'Penguin', habitat: 'Coast', region: 'Antarctica' },
  { emoji: '🦉', name: 'Snowy Owl', habitat: 'Tundra', region: 'Arctic' },
  { emoji: '🐢', name: 'Sea Turtle', habitat: 'Ocean', region: 'Tropics' },
  { emoji: '🦒', name: 'Giraffe', habitat: 'Savanna', region: 'Africa' },
  { emoji: '🦦', name: 'Sea Otter', habitat: 'Coast', region: 'Pacific' },
  { emoji: '🦘', name: 'Kangaroo', habitat: 'Grassland', region: 'Australia' },
  { emoji: '🐨', name: 'Koala', habitat: 'Eucalyptus forest', region: 'Australia' }
];

const Demo = () => {
  const searchField = useField('');
  const search = searchField.watch();

  const debouncedSearch = useDebounceValue(search, 500);

  const results = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return ANIMALS;
    return ANIMALS.filter(
      (animal) =>
        animal.name.toLowerCase().includes(query) ||
        animal.habitat.toLowerCase().includes(query) ||
        animal.region.toLowerCase().includes(query)
    );
  }, [debouncedSearch]);

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Wildlife explorer</h3>
        <p className='text-muted-foreground text-sm'>
          Search across species — results settle in shortly after you stop typing.
        </p>
      </div>

      <div className='relative w-full'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <input
          className='rounded-full! pl-9!'
          placeholder='Search animals'
          type='text'
          {...searchField.register()}
        />
      </div>

      <div className='no-scrollbar flex max-h-72 flex-col gap-2 overflow-y-auto'>
        {!results.length && (
          <p className='text-muted-foreground py-6 text-center text-sm'>No animals match</p>
        )}

        {results.map((animal) => (
          <div
            key={animal.name}
            className='bg-muted/40 hover:bg-muted/70 flex items-center gap-3 rounded-lg p-3 transition-colors'
          >
            <div data-size='lg' data-slot='avatar'>
              <span data-slot='avatar-fallback'> {animal.emoji}</span>
            </div>

            <div className='flex min-w-0 flex-1 flex-col'>
              <span className='truncate text-sm font-medium'>{animal.name}</span>
              <span className='text-muted-foreground truncate text-xs'>
                {animal.habitat} · {animal.region}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
