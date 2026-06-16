'use client'

import { useBreakpoints } from '@siberiacancode/reactuse';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

const PRODUCTS = [
  { emoji: '🌿', name: 'Monstera', price: '$24' },
  { emoji: '🌵', name: 'Cactus', price: '$12' },
  { emoji: '🌸', name: 'Cherry Blossom', price: '$18' },
  { emoji: '🌻', name: 'Sunflower', price: '$9' },
  { emoji: '🍄', name: 'Mushroom', price: '$14' },
  { emoji: '🌴', name: 'Palm', price: '$32' }
];

const Demo = () => {
  const breakpoints = useBreakpoints(BREAKPOINTS);

  const current = breakpoints.current();

  return (
    <section className='flex justify-center p-6'>
      {current.includes('mobile') &&
        !current.includes('tablet') &&
        !current.includes('desktop') && (
          <div className='relative flex h-107.5 w-66 flex-col gap-4 overflow-hidden rounded-4xl border px-4 pt-12 pb-4'>
            <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

            <div className='flex items-center justify-between px-1'>
              <h3 className='text-3xl!'>Mobile view</h3>
            </div>

            <p className='text-muted-foreground px-1 text-sm'>
              Compact <code>mobile</code> layout for small screens. Stacked content, tap-friendly
              buttons, and short copy that respects narrow viewports.
            </p>

            <div className='flex flex-col gap-2'>
              {PRODUCTS.slice(0, 3).map((product) => (
                <div
                  key={product.name}
                  className='bg-muted flex items-center gap-3 rounded-2xl px-3 py-2'
                >
                  <span className='text-2xl'>{product.emoji}</span>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{product.name}</p>
                    <p className='text-muted-foreground text-xs'>{product.price}</p>
                  </div>
                  <button className='rounded-lg px-2 py-1 text-xs' type='button'>
                    Add
                  </button>
                </div>
              ))}
              <p className='text-muted-foreground text-center text-xs'>+3 more</p>
            </div>
          </div>
        )}

      {current.includes('tablet') && !current.includes('desktop') && (
        <div className='relative flex h-[440px] w-96 flex-col gap-4 overflow-hidden rounded-3xl border px-5 pt-10 pb-5'>
          <div className='bg-border absolute top-4 left-1/2 size-2 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between'>
            <h3 className='text-xl!'>Tablet view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            Balanced <code>tablet</code> layout for medium screens. More room for content with
            comfortable reading width and side margins.
          </p>

          <div className='grid grid-cols-2 gap-2'>
            {PRODUCTS.slice(0, 4).map((product) => (
              <div key={product.name} className='bg-muted flex flex-col gap-1.5 rounded-2xl p-3'>
                <span className='text-3xl'>{product.emoji}</span>
                <div>
                  <p className='text-sm font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>{product.price}</p>
                </div>
                <button className='rounded-lg py-1 text-xs font-medium' type='button'>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {current.includes('desktop') && (
        <div className='flex flex-col items-center'>
          <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
            <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

            <div className='flex items-center justify-between'>
              <h3 className='text-4xl!'>Desktop view</h3>
            </div>

            <p className='text-muted-foreground text-sm'>
              Wide <code>desktop</code> layout for large displays. Multi-column content, persistent
              sidebars, and rich detail panes for productivity.
            </p>

            <div className='mt-5 grid grid-cols-3 gap-2'>
              {PRODUCTS.map((product) => (
                <div key={product.name} className='bg-muted flex flex-col gap-1.5 rounded-xl p-2.5'>
                  <span className='text-2xl'>{product.emoji}</span>
                  <div>
                    <p className='text-xs font-medium'>{product.name}</p>
                    <p className='text-muted-foreground text-[10px]'>{product.price}</p>
                  </div>
                  <button className='rounded-lg py-0.5 text-[10px] font-medium' type='button'>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
          <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
        </div>
      )}
    </section>
  );
};

export default Demo;
