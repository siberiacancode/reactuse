import { useAsync, useCounter } from '@siberiacancode/reactuse';

interface Pokemon {
  id: number;
  name: string;
}

const getPokemon = (id: number) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()) as Promise<Pokemon>;

const Demo = () => {
  const counter = useCounter(1);
  const getPokemonQuery = useAsync(() => getPokemon(counter.value), [counter.value]);

  return (
    <>
      <button disabled={counter.value === 1} type='button' onClick={() => counter.dec()}>
        Prev
      </button>
      <button type='button' onClick={() => counter.inc()}>
        Next
      </button>

      {getPokemonQuery.data && !getPokemonQuery.isLoading && (
        <div className='flex animate-pulse flex-col gap-2'>
          <div className='h-7 w-40 rounded-md bg-neutral-600' />
          <div className='size-96 rounded-md bg-neutral-600' />
        </div>
      )}

      {getPokemonQuery.data && (
        <div className='flex flex-col gap-2'>
          <p>
            Name: <code>{getPokemonQuery.data.name}</code>
          </p>
          <div className='size-96'>
            <img
              alt={getPokemonQuery.data.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonQuery.data.id}.png`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Demo;
