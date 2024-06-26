import { useCounter } from '../useCounter/useCounter';

import { useQuery } from './useQuery';

interface Pokemon {
  id: number;
  name: string;
}

const getPokemon = (id: number) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()) as Promise<Pokemon>;

const Demo = () => {
  const counter = useCounter(1);
  const getPokemonQuery = useQuery(() => getPokemon(counter.count), {
    keys: [counter.count],
    refetchInterval: 2000
  });

  return (
    <>
      <button type='button' disabled={counter.count === 1} onClick={() => counter.dec()}>
        Prev
      </button>
      <button type='button' onClick={() => counter.inc()}>
        Next
      </button>

      {getPokemonQuery.data && (
        <div>
          <p>
            Name: <code>{getPokemonQuery.data.name}</code>
          </p>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonQuery.data.id}.png`}
            alt={getPokemonQuery.data.name}
          />
        </div>
      )}
    </>
  );
};

export default Demo;
