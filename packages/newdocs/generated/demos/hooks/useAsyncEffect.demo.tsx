'use client'

import { useAsyncEffect, useBoolean, useToggle } from '@siberiacancode/reactuse';
import { ChevronRightIcon, Loader2Icon } from 'lucide-react';
import { Fragment, useState } from 'react';

interface Pokemon {
  id: number;
  name: string;
}

const CHAINS = {
  bulbasaur: [1, 2, 3],
  charmander: [4, 5, 6],
  squirtle: [7, 8, 9]
};

const getPokemons = async (ids: number[]): Promise<Pokemon[]> => {
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
    <section className='flex min-w-xs flex-col gap-2 md:min-w-md'>
      <div className='gap-2' data-slot='tabs'>
        <div data-slot='tabs-list'>
          {Object.keys(CHAINS).map((name) => (
            <button
              key={name}
              data-state={chain === name ? 'active' : undefined}
              data-variant='tabs-trigger'
              type='button'
              onClick={() => toggleChain(name as keyof typeof CHAINS)}
            >
              {name}
            </button>
          ))}
        </div>

        <div
          className='border-border bg-card flex h-40 min-h-40 items-center justify-center overflow-hidden rounded-xl border p-4'
          data-slot='tabs-content'
        >
          <div className='flex h-full min-h-0 w-full items-center justify-center'>
            {isLoading ? (
              <Loader2Icon className='text-muted-foreground size-6 animate-spin' />
            ) : (
              <div className='flex h-full items-center justify-center gap-2'>
                {pokemons.map((pokemon, index) => (
                  <Fragment key={pokemon.id}>
                    <div className='flex h-full w-24 shrink-0 flex-col items-center justify-center gap-2'>
                      <div className='size-20 shrink-0 md:size-24'>
                        <img
                          alt={pokemon.name}
                          className='size-full object-contain'
                          height={96}
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                          width={96}
                        />
                      </div>
                      <p className='text-foreground h-5 text-sm font-medium capitalize'>
                        {pokemon.name}
                      </p>
                    </div>

                    {index < pokemons.length - 1 && (
                      <ChevronRightIcon className='text-muted-foreground size-5 shrink-0' />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
