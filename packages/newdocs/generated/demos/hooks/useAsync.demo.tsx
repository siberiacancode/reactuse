'use client'

import { useAsync, useCounter } from '@siberiacancode/reactuse';
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon } from 'lucide-react';

interface Pokemon {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  weight: number;
}

const getPokemon = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (id === 3) throw new Error('Pokemon blocked for demo');
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
    res.json()
  ) as Promise<Pokemon>;
};

const Demo = () => {
  const counter = useCounter(1);
  const getPokemonQuery = useAsync(() => getPokemon(counter.value), [counter.value]);

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <p>
          Index: <code>{counter.value}</code>
        </p>

        <div className='flex gap-2'>
          <button
            disabled={counter.value === 1 || getPokemonQuery.isLoading}
            type='button'
            onClick={() => counter.dec()}
          >
            <ArrowLeftIcon className='size-4' /> Prev
          </button>

          <button disabled={getPokemonQuery.isLoading} type='button' onClick={() => counter.inc()}>
            Next <ArrowRightIcon className='size-4' />
          </button>
        </div>
      </div>

      <div className='w-full min-w-md rounded-lg border p-4'>
        {getPokemonQuery.isLoading && (
          <div className='flex h-44 flex-col items-center justify-center gap-2'>
            <Loader2Icon className='size-5 animate-spin' />
            <p>Loading</p>
          </div>
        )}

        {getPokemonQuery.error && !getPokemonQuery.isLoading && (
          <div className='flex h-44 items-center justify-center'>
            <p className='text-destructive'>{getPokemonQuery.error.message}</p>
          </div>
        )}

        {getPokemonQuery.data && !getPokemonQuery.isLoading && !getPokemonQuery.error && (
          <div className='flex items-center justify-center gap-10'>
            <div className='flex size-44 items-center justify-center'>
              <img
                alt={getPokemonQuery.data.name}
                className='h-44'
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonQuery.data.id}.png`}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <p>
                name: <code>{getPokemonQuery.data.name}</code>
              </p>

              <p>
                height: <code>{getPokemonQuery.data.height}</code>
              </p>

              <p>
                weight: <code>{getPokemonQuery.data.weight}</code>
              </p>

              <p>
                experience: <code>{getPokemonQuery.data.base_experience}</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
