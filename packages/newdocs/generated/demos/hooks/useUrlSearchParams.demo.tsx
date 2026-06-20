'use client'

import { useUrlSearchParams } from '@siberiacancode/reactuse';
import { ClockIcon, SearchIcon } from 'lucide-react';

const RECIPES = [
  {
    emoji: '🍕',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    time: 30,
    description: 'Classic Naples-style pizza with a thin, blistered crust and fresh basil.',
    ingredients: ['Dough', 'Tomatoes', 'Mozzarella', 'Basil', 'Olive oil']
  },
  {
    emoji: '🍣',
    name: 'Salmon Sushi',
    cuisine: 'Japanese',
    time: 45,
    description: 'Delicate nigiri topped with buttery fresh salmon over seasoned rice.',
    ingredients: ['Sushi rice', 'Salmon', 'Nori', 'Soy sauce', 'Wasabi']
  },
  {
    emoji: '🌮',
    name: 'Beef Tacos',
    cuisine: 'Mexican',
    time: 25,
    description: 'Crispy tacos loaded with spiced beef, cheddar and a punch of fresh salsa.',
    ingredients: ['Tortillas', 'Ground beef', 'Onion', 'Cheddar', 'Salsa']
  },
  {
    emoji: '🥗',
    name: 'Greek Salad',
    cuisine: 'Greek',
    time: 15,
    description: 'Crisp cucumbers, juicy tomatoes and creamy feta with a drizzle of olive oil.',
    ingredients: ['Cucumber', 'Tomatoes', 'Feta', 'Olives', 'Red onion']
  },
  {
    emoji: '🍝',
    name: 'Pasta Carbonara',
    cuisine: 'Italian',
    time: 20,
    description: 'Silky Roman pasta with eggs, crispy pancetta and plenty of parmesan.',
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Black pepper']
  },
  {
    emoji: '🍜',
    name: 'Veggie Ramen',
    cuisine: 'Japanese',
    time: 35,
    description: 'Warming miso broth with springy noodles, tofu and earthy mushrooms.',
    ingredients: ['Ramen noodles', 'Miso', 'Tofu', 'Mushrooms', 'Scallions']
  },
  {
    emoji: '🌯',
    name: 'Bean Burrito',
    cuisine: 'Mexican',
    time: 20,
    description: 'Hearty wrap stuffed with black beans, rice, avocado and sweet corn.',
    ingredients: ['Tortilla', 'Black beans', 'Rice', 'Avocado', 'Corn']
  },
  {
    emoji: '🥘',
    name: 'Seafood Paella',
    cuisine: 'Spanish',
    time: 50,
    description: 'Saffron-scented rice simmered with shrimp, mussels and sweet peas.',
    ingredients: ['Rice', 'Shrimp', 'Mussels', 'Saffron', 'Peas']
  }
];

const CUISINES = ['All', 'Italian', 'Japanese', 'Mexican', 'Greek', 'Spanish'];

interface Filters {
  cuisine: string;
  search: string;
}

const Demo = () => {
  const filters = useUrlSearchParams<Filters>({
    search: '',
    cuisine: 'All'
  });

  const { search, cuisine } = filters.value;

  const results = RECIPES.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesCuisine = cuisine === 'All' || recipe.cuisine === cuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <section className='flex w-full max-w-lg flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Discover recipes</h3>
        <p className='text-muted-foreground text-sm'>
          Filter the cookbook — your choices are saved in the URL, so you can share the exact view.
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <input
            className='w-full rounded-lg! pl-9!'
            placeholder='Search recipes…'
            type='text'
            value={search}
            onChange={(event) => filters.set({ search: event.target.value })}
          />
        </div>

        <select value={cuisine} onChange={(event) => filters.set({ cuisine: event.target.value })}>
          {CUISINES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className='no-scrollbar flex max-h-96 flex-col gap-2 overflow-y-auto'>
        {!results.length && (
          <p className='text-muted-foreground py-8 text-center text-sm'>No recipes match</p>
        )}

        {results.map((recipe) => (
          <div
            key={recipe.name}
            className='bg-card flex min-h-[88px] gap-3 overflow-hidden rounded-xl p-3'
          >
            <span className='bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg text-2xl'>
              {recipe.emoji}
            </span>

            <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
              <div className='flex items-center justify-between gap-2'>
                <span className='text-foreground truncate text-sm font-medium'>{recipe.name}</span>
                <span className='text-muted-foreground flex shrink-0 items-center gap-1 text-xs'>
                  <ClockIcon className='size-3' />
                  {recipe.time} min
                </span>
              </div>
              <p className='text-muted-foreground truncate text-xs'>{recipe.description}</p>
              <p className='text-muted-foreground/70 truncate text-[11px]'>
                {recipe.ingredients.join(' · ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
