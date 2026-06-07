'use client'

import { useAsync, useKeyPress } from '@siberiacancode/reactuse';
import { HeartIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface Pokemon {
  height: number;
  id: number;
  name: string;
  types: { type: { name: string } }[];
  weight: number;
}

const MIN_ID = 1;
const MAX_ID = 500;

const randomId = () => Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const fetchPokemon = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (response) => response.json() as Promise<Pokemon>
  );
};

const Demo = () => {
  const [id, setId] = useState(randomId);
  const pokemonAsync = useAsync(() => fetchPokemon(id), [id]);

  const onNext = () => setId(randomId());

  useKeyPress('ArrowLeft', (pressed) => {
    if (pressed) onNext();
  });

  useKeyPress('ArrowRight', (pressed) => {
    if (pressed) onNext();
  });

  const loading = !pokemonAsync.data;

  return (
    <section className='flex w-full max-w-[280px] flex-col items-center gap-3 p-4'>
      <div className='border-border bg-card relative aspect-[3/4] w-full overflow-hidden rounded-2xl border shadow-lg'>
        <div className='absolute inset-0 flex items-center justify-center'>
          {loading && <Loader2Icon className='text-muted-foreground size-8 animate-spin' />}
          {!loading && pokemonAsync.data && (
            <img
              key={id}
              alt={pokemonAsync.data.name}
              className='animate-in fade-in size-2/3 object-contain duration-300'
              src={getImageUrl(id)}
            />
          )}
        </div>

        {!loading && pokemonAsync.data && (
          <>
            <div className='absolute top-3 left-3 z-10'>
              <span className='border-border bg-card/80 text-foreground inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums backdrop-blur-md'>
                #{String(id).padStart(3, '0')}
              </span>
            </div>

            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent' />

            <div className='animate-in fade-in absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 duration-300'>
              <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-white capitalize'>
                  {pokemonAsync.data.name}
                </span>
                <span className='font-mono text-[10px] text-white/60 tabular-nums'>
                  {(pokemonAsync.data.height / 10).toFixed(1)} m ·{' '}
                  {(pokemonAsync.data.weight / 10).toFixed(1)} kg
                </span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {pokemonAsync.data.types.map((type) => (
                  <span
                    key={type.type.name}
                    className='rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-medium tracking-wider text-white uppercase backdrop-blur-md'
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <button
              aria-label='Pass'
              className='absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition-transform hover:scale-110'
              data-variant='unstyled'
              type='button'
              onClick={onNext}
            >
              <XIcon className='size-5' strokeWidth={2.5} />
            </button>

            <button
              aria-label='Like'
              className='text-destructive absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110'
              data-variant='unstyled'
              type='button'
              onClick={onNext}
            >
              <HeartIcon className='size-5' fill='currentColor' />
            </button>
          </>
        )}
      </div>

      <span className='text-muted-foreground text-[10px]'>Use ← → keys to swipe</span>
    </section>
  );
};

export default Demo;
