import { useCookie } from '../useCookie/useCookie';
import { useCookies } from './useCookies';

const POKEMONS = [
  { name: 'Pikachu', index: 25 },
  { name: 'Bulbasaur', index: 1 },
  { name: 'Charmander', index: 4 },
  { name: 'Squirtle', index: 7 },
  { name: 'Jigglypuff', index: 39 },
  { name: 'Gengar', index: 94 },
  { name: 'Mewtwo', index: 150 },
  { name: 'Mew', index: 151 },
  { name: 'Charizard', index: 6 },
  { name: 'Blastoise', index: 9 },
  { name: 'Venusaur', index: 3 }
];

const Demo = () => {
  const pokemonsCookie = useCookie('pokemon', POKEMONS[0]);
  const cookies = useCookies<{ name: string; id: number }>();

  return (
    <div>
      <div>Cookies</div>
      <pre>{JSON.stringify(cookies.value, null, 2)}</pre>

      <button
        onClick={() => pokemonsCookie.set(POKEMONS[Math.floor(Math.random() * POKEMONS.length)])}
      >
        Change user
      </button>
      <button onClick={cookies.clear}>Clear</button>
    </div>
  );
};

export default Demo;
