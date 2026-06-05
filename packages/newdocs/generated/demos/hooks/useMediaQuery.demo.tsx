'use client'

import { useMediaQuery } from '@siberiacancode/reactuse';

const PLACES = [
  { emoji: '⛩️', name: 'Kyoto', country: 'Japan' },
  { emoji: '🗼', name: 'Paris', country: 'France' },
  { emoji: '🏛️', name: 'Athens', country: 'Greece' },
  { emoji: '🗽', name: 'New York', country: 'USA' },
  { emoji: '🕌', name: 'Istanbul', country: 'Turkey' },
  { emoji: '🏯', name: 'Osaka', country: 'Japan' }
];

const Demo = () => {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const view = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';

  if (view === 'mobile') {
    return (
      <section className='flex justify-center p-6'>
        <div className='relative flex h-[430px] w-[264px] flex-col gap-4 overflow-hidden rounded-[2rem] border px-4 pt-12 pb-4'>
          <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

          <h3 className='text-2xl font-bold'>Mobile view</h3>
          <p className='text-muted-foreground text-sm'>
            Compact <code>mobile</code> layout for small screens. Stacked cards, tap-friendly rows,
            and short copy for narrow viewports.
          </p>

          <div className='flex flex-col gap-2'>
            {PLACES.slice(0, 3).map((place) => (
              <div
                key={place.name}
                className='bg-muted flex items-center gap-3 rounded-2xl border px-3 py-2'
              >
                <span className='text-2xl'>{place.emoji}</span>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{place.name}</p>
                  <p className='text-muted-foreground text-xs'>{place.country}</p>
                </div>
                <button className='rounded-lg px-2 py-1 text-xs' type='button'>
                  Visit
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

          <h3 className='text-xl font-bold'>Tablet view</h3>
          <p className='text-muted-foreground text-sm'>
            Balanced <code>tablet</code> layout for medium screens. A two-column grid with more room
            for content and comfortable margins.
          </p>

          <div className='grid grid-cols-2 gap-2'>
            {PLACES.slice(0, 4).map((place) => (
              <div
                key={place.name}
                className='bg-muted flex flex-col gap-1.5 rounded-2xl border p-3'
              >
                <span className='text-3xl'>{place.emoji}</span>
                <div>
                  <p className='text-sm font-medium'>{place.name}</p>
                  <p className='text-muted-foreground text-xs'>{place.country}</p>
                </div>
                <button className='rounded-lg py-1 text-xs font-medium' type='button'>
                  Visit
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

          <h3 className='text-2xl font-bold'>Desktop view</h3>
          <p className='text-muted-foreground text-sm'>
            Wide <code>desktop</code> layout for large displays. A three-column grid showing the
            full catalog at once with rich detail.
          </p>

          <div className='mt-3 grid grid-cols-3 gap-2'>
            {PLACES.map((place) => (
              <div
                key={place.name}
                className='bg-muted flex flex-col gap-1.5 rounded-xl border p-2.5'
              >
                <span className='text-2xl'>{place.emoji}</span>
                <div>
                  <p className='text-xs font-medium'>{place.name}</p>
                  <p className='text-muted-foreground text-[10px]'>{place.country}</p>
                </div>
                <button className='rounded-lg py-0.5 text-[10px] font-medium' type='button'>
                  Visit
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
