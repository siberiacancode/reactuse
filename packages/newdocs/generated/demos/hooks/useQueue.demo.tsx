'use client'

import { useInterval, useQueue } from '@siberiacancode/reactuse';
import { CheckIcon } from 'lucide-react';

interface Order {
  emoji: string;
  id: string;
  name: string;
}

const MENU = [
  { emoji: '🍔', name: 'Burger' },
  { emoji: '🍟', name: 'Fries' },
  { emoji: '🌭', name: 'Hot Dog' },
  { emoji: '🥤', name: 'Soda' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🌮', name: 'Taco' }
];

const createOrder = (): Order => {
  const item = MENU[Math.floor(Math.random() * MENU.length)];
  return { id: crypto.randomUUID(), ...item };
};

const Demo = () => {
  const { queue, add, remove, first, size } = useQueue<Order>(
    Array.from({ length: 3 }, createOrder)
  );

  useInterval(() => {
    if (size >= 20) return;
    add(createOrder());
  }, 1800);

  const waiting = queue.slice(1);

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-base!'>Kitchen orders</h3>
        <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium tabular-nums'>
          {size} in queue
        </span>
      </div>

      <div className='border-border bg-card flex min-h-20 items-center gap-3 rounded-xl border p-4'>
        {first && (
          <>
            <span className='text-4xl'>{first.emoji}</span>
            <div className='flex flex-1 flex-col'>
              <span className='text-muted-foreground text-xs'>Now cooking</span>
              <span className='text-foreground text-sm font-semibold'>{first.name}</span>
            </div>
            <button
              aria-label='Complete order'
              className='rounded-full!'
              data-size='icon'
              type='button'
              onClick={remove}
            >
              <CheckIcon className='size-4' />
            </button>
          </>
        )}

        {!first && (
          <span className='text-muted-foreground w-full py-1 text-center text-sm'>
            Waiting for orders...
          </span>
        )}
      </div>

      <div className='flex min-h-12 flex-wrap items-center gap-2'>
        {waiting.map((order) => (
          <div
            key={order.id}
            className='border-border bg-muted/40 animate-in fade-in flex size-11 items-center justify-center rounded-lg border text-xl'
          >
            {order.emoji}
          </div>
        ))}

        {!waiting.length && (
          <span className='text-muted-foreground self-center text-xs'>No orders waiting</span>
        )}
      </div>
    </section>
  );
};

export default Demo;
