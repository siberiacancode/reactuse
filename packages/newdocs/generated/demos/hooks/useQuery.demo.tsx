'use client'

import { useQuery } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Pokemon {
  id: number;
  name: string;
}

interface Generation {
  pokemon_species: { name: string; url: string }[];
}

const GENERATIONS = [
  { id: 1, label: 'Gen I' },
  { id: 2, label: 'Gen II' },
  { id: 3, label: 'Gen III' },
  { id: 4, label: 'Gen IV' }
];

const getIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
};

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const fetchGeneration = async (generation: number): Promise<Pokemon[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const data = (await fetch(`https://pokeapi.co/api/v2/generation/${generation}`).then((res) =>
    res.json()
  )) as Generation;

  return data.pokemon_species
    .map((species) => ({ name: species.name, id: getIdFromUrl(species.url) }))
    .sort((a, b) => a.id - b.id);
};

const Demo = () => {
  const [generation, setGeneration] = useState(1);

  const pokemonQuery = useQuery(() => fetchGeneration(generation), {
    keys: [generation]
  });

  const loading = pokemonQuery.isLoading || pokemonQuery.isRefetching;
  const pokemon = pokemonQuery.data ?? [];

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='bg-muted flex items-center gap-0.5 self-start rounded-lg p-0.5'>
        {GENERATIONS.map((item) => (
          <button
            key={item.id}
            className={cn(
              'rounded-md! px-3 py-1 text-xs font-medium transition-colors',
              generation === item.id ? 'bg-background shadow-sm' : 'text-muted-foreground'
            )}
            data-variant='unstyled'
            type='button'
            onClick={() => setGeneration(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className='no-scrollbar h-[340px] overflow-y-auto'>
        <div className='grid auto-rows-[112px] grid-cols-2 gap-2 sm:auto-rows-[96px] sm:grid-cols-4'>
          {loading &&
            Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className='border-border bg-card h-full animate-pulse rounded-xl border p-2'
              />
            ))}

          {!loading &&
            pokemon.map((item) => (
              <div
                key={item.id}
                className='border-border bg-card hover:bg-muted/40 flex h-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border p-2 transition-colors'
              >
                <img
                  alt={item.name}
                  className='size-16 object-contain'
                  loading='lazy'
                  src={getImageUrl(item.id)}
                />
                <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                  #{String(item.id).padStart(3, '0')}
                </span>
                <span className='text-foreground w-full truncate text-center text-xs font-medium capitalize'>
                  {item.name}
                </span>
              </div>
            ))}
        </div>
      </div>

      <p className='text-muted-foreground text-center text-xs'>
        {loading ? 'Loading Pokémon…' : `${pokemon.length} Pokémon in this generation`}
      </p>
    </section>
  );
};

export default Demo;
