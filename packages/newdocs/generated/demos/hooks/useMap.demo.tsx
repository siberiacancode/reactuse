'use client';

import { useMap } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

interface Product {
  emoji: string;
  id: string;
  name: string;
  price: number;
  weight: string;
}

const CATALOG: Product[] = [
  { id: 'bread', name: 'Baltic bread', price: 46, weight: '400 g', emoji: '🍞' },
  { id: 'cheese', name: 'Almette cream cheese', price: 152, weight: '150 g', emoji: '🧀' },
  { id: 'milk', name: 'Farm milk', price: 89, weight: '1 L', emoji: '🥛' },
  { id: 'eggs', name: 'Free-range eggs', price: 120, weight: '10 pcs', emoji: '🥚' },
  { id: 'butter', name: 'Creamy butter', price: 180, weight: '200 g', emoji: '🧈' },
  { id: 'banana', name: 'Bananas', price: 95, weight: '1 kg', emoji: '🍌' }
];

const PRODUCT_BY_ID = new Map(CATALOG.map((product) => [product.id, product]));

const Demo = () => {
  const cart = useMap<string, number>([
    ['bread', 2],
    ['cheese', 1]
  ]);

  const onAdd = (id: string) => {
    cart.set(id, (cart.value.get(id) ?? 0) + 1);
  };

  const onDecrement = (id: string) => {
    const current = cart.value.get(id) ?? 0;
    if (current <= 1) {
      if (cart.size <= 1) return;
      cart.remove(id);
    } else {
      cart.set(id, current - 1);
    }
  };

  const items = Array.from(cart.value, ([id, qty]) => ({
    product: PRODUCT_BY_ID.get(id)!,
    qty
  }));

  const total = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);

  return (
    <section className='flex w-full max-w-sm flex-col gap-5 p-4'>
      <div className='flex flex-col gap-3'>
        <h2 className='text-foreground text-base font-semibold'>Cart</h2>

        {items.map(({ product, qty }) => {
          const isLastItem = cart.size <= 1 && qty <= 1;
          return (
            <div key={product.id} className='flex items-center gap-3'>
              <div className='bg-muted/40 flex size-10 shrink-0 items-center justify-center rounded-lg text-xl'>
                {product.emoji}
              </div>
              <div className='flex min-w-0 flex-1 flex-col leading-tight'>
                <span className='text-foreground truncate text-sm'>{product.name}</span>
                <span className='text-muted-foreground text-[10px]'>{product.weight}</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <button
                  aria-label='Decrease'
                  className='rounded-full!'
                  data-size='icon-xs'
                  data-variant='outline'
                  disabled={isLastItem}
                  type='button'
                  onClick={() => onDecrement(product.id)}
                >
                  <MinusIcon className='size-3' />
                </button>
                <span className='text-foreground w-4 text-center font-mono text-xs font-semibold tabular-nums'>
                  {qty}
                </span>
                <button
                  aria-label='Increase'
                  className='rounded-full!'
                  data-size='icon-xs'
                  data-variant='outline'
                  type='button'
                  onClick={() => onAdd(product.id)}
                >
                  <PlusIcon className='size-3' />
                </button>
              </div>
              <span className='text-foreground w-12 text-right font-mono text-sm font-semibold tabular-nums'>
                ${product.price * qty}
              </span>
            </div>
          );
        })}

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <span className='text-muted-foreground text-sm'>Total</span>
          <span className='text-foreground font-mono text-lg font-bold tabular-nums'>${total}</span>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {CATALOG.map((product) => {
          const inCart = cart.has(product.id);
          return (
            <div
              key={product.id}
              className='border-border bg-card flex flex-col gap-1.5 rounded-xl border p-2'
            >
              <div className='bg-muted/40 flex h-12 items-center justify-center rounded-lg text-2xl'>
                {product.emoji}
              </div>
              <span className='text-muted-foreground line-clamp-1 text-[10px] leading-tight'>
                {product.name}
              </span>
              <button
                className={cn(
                  'flex h-7 items-center justify-center rounded-lg border transition-colors',
                  inCart
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card hover:bg-muted/40'
                )}
                aria-label={`Add ${product.name}`}
                data-variant='unstyled'
                type='button'
                onClick={() => onAdd(product.id)}
              >
                {inCart ? (
                  <span className='font-mono text-xs font-semibold tabular-nums'>
                    {cart.value.get(product.id)}
                  </span>
                ) : (
                  <PlusIcon className='size-4' />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Demo;
