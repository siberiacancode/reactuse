import { useCounter } from '../useCounter/useCounter';
import { useQuery } from './useQuery';

interface Pokemon {
  id: number;
  name: string;
}

const getPokemon = (id: number) =>
  fetch(`https://pokeapi.co/api/v2/pokemon2/${id}`).then((res) => res.json()) as Promise<Pokemon>;

const Demo = () => {
  const counter = useCounter(1);
  const getPokemonQuery = useQuery(() => getPokemon(counter.value), {
    keys: [counter.value]
  });

  return (
    <>
      <button disabled={counter.value === 1} type='button' onClick={() => counter.dec()}>
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
            alt={getPokemonQuery.data.name}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonQuery.data.id}.png`}
          />
        </div>
      )}
    </>
  );
};

export default Demo;
