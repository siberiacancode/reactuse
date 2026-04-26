'use client'

import { useAsyncEffect, useBoolean, useToggle } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';
import { Fragment, useState } from 'react';

import { cn } from '@/utils/lib';

interface Pokemon {
  id: number;
  name: string;
}

const CHAINS = {
  bulbasaur: [1, 2, 3],
  charmander: [4, 5, 6],
  squirtle: [7, 8, 9]
};

const getPokemons = async (ids: number[]) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.all(
    ids.map((id) => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()))
  );
};

const Demo = () => {
  const [chain, toggleChain] = useToggle<keyof typeof CHAINS>([
    'bulbasaur',
    'charmander',
    'squirtle'
  ]);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useBoolean(true);

  useAsyncEffect(async () => {
    setIsLoading(true);
    const data = await getPokemons(CHAINS[chain]);
    setPokemons(data);
    setIsLoading(false);
  }, [chain]);

  return (
    <section className='flex min-w-md flex-col gap-4'>
      <div data-slot='tabs'>
        <div className='mb-6' data-slot='tabs-list'>
          {Object.keys(CHAINS).map((name) => (
            <button
              key={name}
              data-state={cn(chain === name && 'active')}
              data-variant='tabs-trigger'
              type='button'
              onClick={() => toggleChain(name as keyof typeof CHAINS)}
            >
              {name}
            </button>
          ))}
        </div>

        <div data-slot='tabs-content'>
          {isLoading && (
            <div className='flex h-36 flex-col items-center justify-center gap-2'>
              <Loader2Icon className='size-6 animate-spin' />
              <p>
                Loading <code>evolution</code> chain
              </p>
            </div>
          )}

          {!isLoading && (
            <div className='flex h-36 items-center justify-between gap-2'>
              {pokemons.map((pokemon, index) => (
                <Fragment key={pokemon.id}>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='flex size-28 items-center justify-center'>
                      <img
                        alt={pokemon.name}
                        className='h-28'
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                      />
                    </div>

                    <p className='text-sm capitalize'>{pokemon.name}</p>
                  </div>

                  {index < pokemons.length - 1 && <div className='text-xl'>{'>'}</div>}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
