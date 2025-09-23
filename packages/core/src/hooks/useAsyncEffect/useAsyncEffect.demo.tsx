import { useAsyncEffect } from '@siberiacancode/reactuse';
import { useState } from 'react';

interface Pokemon {
  abilities: string[];
  height: number;
  id: number;
  name: string;
  types: string[];
  weight: number;
}

const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 150) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();

  return {
    name: data.name,
    id: data.id,
    height: data.height,
    weight: data.weight,
    types: data.types.map((type: any) => type.type.name),
    abilities: data.abilities.map((ability: any) => ability.ability.name)
  } as Pokemon;
};

const Demo = () => {
  const [pokemon, setPokemon] = useState<Pokemon>();

  useAsyncEffect(async () => {
    try {
      const newPokemon = await getRandomPokemon();
      setPokemon(newPokemon);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <div className='flex flex-col gap-4'>
        {pokemon && (
          <div>
            <h3 className='mb-1 text-2xl font-bold capitalize'>
              {pokemon.name} #{pokemon.id}
            </h3>

            <div className='flex gap-2 text-sm'>
              {pokemon.types.map((type) => (
                <code key={type}>{type}</code>
              ))}
            </div>

            <div className='mt-4 flex flex-col gap-1'>
              <div>
                height: <code>{pokemon.height / 10} m</code>
              </div>
              <div>
                weight: <code>{pokemon.weight / 10} kg</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Demo;
