'use client';

import { useAsync, useHover } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

interface Pokemon {
  id: number;
  name: string;
}

const fetchPokemon = async (name: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(
    (response) => response.json() as Promise<Pokemon>
  );
};

interface PokemonLinkProps {
  name: string;
}

const PokemonLink = ({ name }: PokemonLinkProps) => {
  const hover = useHover<HTMLSpanElement>();

  const pokemonAsync = useAsync(async () => {
    if (!hover.value) return;
    return await fetchPokemon(name);
  }, [hover.value]);

  return (
    <span className='relative'>
      <span
        ref={hover.ref}
        className={cn(
          'text-foreground decoration-foreground/40 hover:decoration-foreground font-medium capitalize underline underline-offset-2 transition-colors',
          pokemonAsync.isLoading ? 'cursor-wait' : 'cursor-help'
        )}
      >
        {name}
      </span>

      {hover.value && !pokemonAsync.isLoading && pokemonAsync.data && (
        <span className='animate-in fade-in slide-in-from-top-1 border-border bg-card absolute top-full left-1/2 z-10 mt-2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-xl border p-3 shadow-lg duration-200'>
          <span className='bg-muted/40 flex size-20 items-center justify-center rounded-lg'>
            <img
              alt={pokemonAsync.data.name}
              className='size-[56px] object-contain'
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonAsync.data.id}.png`}
            />
          </span>

          <span className='flex flex-col items-start justify-start gap-0.5 leading-tight'>
            <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
              #{String(pokemonAsync.data.id).padStart(3, '0')}
            </span>
            <span className='text-foreground text-sm font-semibold capitalize'>
              {pokemonAsync.data.name}
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

const Demo = () => (
  <section className='relative flex w-full max-w-md flex-col p-4'>
    <p className='text-muted-foreground text-base leading-relaxed'>
      Every trainer in Kanto begins their adventure by choosing one of three iconic starter Pokémon
      from Professor Oak's lab: <PokemonLink name='bulbasaur' /> for those who value defense and
      strategy, <PokemonLink name='charmander' /> for trainers who prefer raw offensive power, or{' '}
      <PokemonLink name='squirtle' /> for a balanced and reliable companion. Later, deep in the
      forests of Route 25, you might encounter a wild <PokemonLink name='pikachu' /> — the
      franchise's most beloved mascot and a fierce electric-type fighter in its own right.
    </p>
  </section>
);

export default Demo;
