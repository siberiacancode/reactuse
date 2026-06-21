'use client'

import { useWindowSize } from '@siberiacancode/reactuse';

const DISHES = [
  { emoji: '🍕', name: 'Pizza', place: 'Naples' },
  { emoji: '🍣', name: 'Sushi', place: 'Tokyo' },
  { emoji: '🥐', name: 'Croissant', place: 'Paris' },
  { emoji: '🌮', name: 'Tacos', place: 'Mexico City' },
  { emoji: '🍜', name: 'Ramen', place: 'Osaka' },
  { emoji: '🥘', name: 'Paella', place: 'Valencia' }
];

const Demo = () => {
  const windowSize = useWindowSize();
  const { width } = windowSize.watch();

  const view = width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';

  if (view === 'mobile') {
    return (
      <section className='flex justify-center p-6'>
        <div className='relative flex h-107.5 w-66 flex-col gap-4 overflow-hidden rounded-4xl border px-4 pt-12 pb-4'>
          <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between px-1'>
            <h3 className='text-3xl!'>Mobile view</h3>
          </div>

          <p className='text-muted-foreground px-1 text-sm'>
            A compact layout for small screens. Dishes are stacked into a single column with
            tap-friendly actions and short, scannable copy.
          </p>

          <div className='flex flex-col gap-2'>
            {DISHES.slice(0, 3).map((dish) => (
              <div
                key={dish.name}
                className='bg-muted flex items-center gap-3 rounded-2xl px-3 py-2'
              >
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-xs'>{dish.place}</p>
                </div>
                <button className='rounded-lg px-2 py-1 text-xs' type='button'>
                  Order
                </button>
              </div>
            ))}
            <p className='text-muted-foreground text-center text-xs'>+3 more</p>
          </div>
        </div>
      </section>
    );
  }

  if (view === 'tablet') {
    return (
      <section className='flex justify-center p-6'>
        <div className='relative flex h-[440px] w-96 flex-col gap-4 overflow-hidden rounded-3xl border px-5 pt-10 pb-5'>
          <div className='bg-border absolute top-4 left-1/2 size-2 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between'>
            <h3 className='text-xl!'>Tablet view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            A balanced layout for medium screens. There's room to browse comfortably with a tidy
            two-column grid of dishes.
          </p>

          <div className='grid grid-cols-2 gap-2'>
            {DISHES.slice(0, 4).map((dish) => (
              <div key={dish.name} className='bg-muted flex flex-col gap-1.5 rounded-2xl p-3'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div>
                  <p className='text-sm font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-xs'>{dish.place}</p>
                </div>
                <button className='rounded-lg py-1 text-xs font-medium' type='button'>
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='flex justify-center p-6'>
      <div className='flex flex-col items-center'>
        <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
          <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

          <div className='flex items-center justify-between'>
            <h3 className='text-4xl!'>Desktop view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            A wide layout for large displays. Dishes spread across three columns with richer detail
            and room to compare them side by side.
          </p>

          <div className='mt-5 grid grid-cols-3 gap-2'>
            {DISHES.map((dish) => (
              <div key={dish.name} className='bg-muted flex flex-col gap-1.5 rounded-xl p-2.5'>
                <div data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div>
                  <p className='text-xs font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-[10px]'>{dish.place}</p>
                </div>
                <button className='rounded-lg py-0.5 text-[10px] font-medium' type='button'>
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
        <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
      </div>
    </section>
  );
};

export default Demo;
