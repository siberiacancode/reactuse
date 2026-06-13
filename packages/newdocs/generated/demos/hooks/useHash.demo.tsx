'use client'

import { useHash } from '@siberiacancode/reactuse';
import { MountainIcon, TreesIcon, TriangleIcon, WavesIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const HABITATS = [
  {
    id: 'forest',
    label: 'Forest',
    icon: TreesIcon,
    pokemon: [
      { id: 1, name: 'Bulbasaur' },
      { id: 25, name: 'Pikachu' },
      { id: 10, name: 'Caterpie' },
      { id: 16, name: 'Pidgey' }
    ]
  },
  {
    id: 'cave',
    label: 'Cave',
    icon: TriangleIcon,
    pokemon: [
      { id: 41, name: 'Zubat' },
      { id: 95, name: 'Onix' },
      { id: 74, name: 'Geodude' },
      { id: 50, name: 'Diglett' }
    ]
  },
  {
    id: 'mountain',
    label: 'Mountain',
    icon: MountainIcon,
    pokemon: [
      { id: 6, name: 'Charizard' },
      { id: 149, name: 'Dragonite' },
      { id: 142, name: 'Aerodactyl' },
      { id: 144, name: 'Articuno' }
    ]
  },
  {
    id: 'waterside',
    label: 'Waterside',
    icon: WavesIcon,
    pokemon: [
      { id: 7, name: 'Squirtle' },
      { id: 131, name: 'Lapras' },
      { id: 54, name: 'Psyduck' },
      { id: 120, name: 'Staryu' }
    ]
  }
] as const;

const Demo = () => {
  const hash = useHash('forest');

  const active = HABITATS.find((habitat) => habitat.id === hash.value) ?? HABITATS[0];

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1 px-1'>
        <h2 className='text-foreground text-sm font-semibold'>Pokémon habitats</h2>
        <p className='text-muted-foreground text-xs'>
          Explore where different Pokémon make their home.
        </p>
      </div>

      <div data-slot='tabs'>
        <div data-slot='tabs-list'>
          {HABITATS.map((habitat) => {
            const Icon = habitat.icon;
            return (
              <button
                key={habitat.id}
                data-state={cn(active.id === habitat.id && 'active')}
                data-variant='tabs-trigger'
                type='button'
                onClick={() => hash.set(habitat.id)}
              >
                <Icon className='size-3.5' />
                {habitat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        {active.pokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className='border-border bg-card flex items-center gap-2 rounded-lg border p-2 shadow-sm'
          >
            <div className='bg-muted/40 flex size-12 shrink-0 items-center justify-center rounded-md'>
              <img
                alt={pokemon.name}
                className='size-10 object-contain'
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              />
            </div>
            <div className='flex min-w-0 flex-1 flex-col leading-tight'>
              <span className='text-foreground text-md truncate font-semibold md:text-xs'>
                {pokemon.name}
              </span>
              <span className='text-muted-foreground font-mono text-sm tabular-nums md:text-[10px]'>
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
