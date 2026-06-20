'use client'

import { useSwipe } from '@siberiacancode/reactuse';
import { LockIcon, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Plant {
  emoji: string;
  id: string;
  name: string;
  price: number;
  qty: number;
}

const INITIAL: Plant[] = [
  { id: 'monstera', name: 'Monstera', price: 42, emoji: '🪴', qty: 1 },
  { id: 'cactus', name: 'Mini cactus', price: 18, emoji: '🌵', qty: 2 },
  { id: 'tulip', name: 'Tulips', price: 24, emoji: '🌷', qty: 1 },
  { id: 'palm', name: 'Areca palm', price: 56, emoji: '🌴', qty: 1 }
];

const SHIPPING_RATE = 0.1;

const SwipeRow = ({
  plant,
  isLast,
  onRemove,
  onQty
}: {
  plant: Plant;
  isLast: boolean;
  onRemove: (id: string) => void;
  onQty: (id: string, delta: number) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const qty = plant.qty ?? 1;

  const setX = (x: number) => {
    if (cardRef.current) cardRef.current.style.transform = `translateX(${x}px)`;
    if (bgRef.current) bgRef.current.style.opacity = x < 0 ? '1' : '0';
  };

  const swipe = useSwipe<HTMLDivElement>({
    onStart: () => {
      if (cardRef.current) cardRef.current.style.transition = 'none';
    },
    onMove: (value) => {
      if (value.lengthX <= 0) return setX(0);
      setX(isLast ? -Math.min(value.lengthX * 0.35, 64) : -value.lengthX);
    },
    onEnd: (value) => {
      if (cardRef.current) cardRef.current.style.transition = 'transform 200ms ease-out';

      if (isLast) return setX(0);

      const width = cardRef.current?.offsetWidth ?? 0;
      const dragged = value.lengthX > 0 ? value.lengthX : 0;
      const shouldRemove = width > 0 && dragged / width >= 0.4;

      if (shouldRemove) {
        setX(-width);
        setTimeout(onRemove, 180, plant.id);
      } else {
        setX(0);
      }
    }
  });

  return (
    <div className='relative overflow-hidden'>
      <div
        ref={bgRef}
        className={cn(
          'absolute inset-0 flex items-center justify-end pr-4 transition-opacity',
          isLast ? 'bg-muted' : 'bg-destructive'
        )}
        style={{ opacity: 0 }}
      >
        {isLast ? (
          <LockIcon className='text-muted-foreground size-4' />
        ) : (
          <Trash2Icon className='size-4 text-white' />
        )}
      </div>

      <div ref={swipe.ref} className='relative' style={{ touchAction: 'pan-y' }}>
        <div
          ref={cardRef}
          className='bg-background flex flex-col gap-3 py-3 pr-2 select-none sm:flex-row sm:items-center'
          style={{ transform: 'translateX(0)' }}
        >
          <div className='flex items-center gap-3'>
            <div data-size='lg' data-slot='avatar'>
              <span data-slot='avatar-fallback'>{plant.emoji}</span>
            </div>
            <div className='flex min-w-0 flex-1 flex-col leading-tight'>
              <span className='text-foreground truncate text-sm'>{plant.name}</span>
              <span className='text-muted-foreground text-[10px] tabular-nums'>
                ${plant.price} each
              </span>
            </div>
            <span className='text-foreground shrink-0 font-mono text-sm font-semibold tabular-nums sm:hidden'>
              ${plant.price * qty}
            </span>
          </div>

          <div className='flex items-center gap-3 sm:ml-auto'>
            <div className='flex shrink-0 items-center gap-1.5'>
              <button
                aria-label='Decrease'
                className='rounded-full!'
                data-size='icon-xs'
                data-variant='outline'
                disabled={isLast && qty <= 1}
                type='button'
                onClick={() => onQty(plant.id, -1)}
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
                onClick={() => onQty(plant.id, 1)}
              >
                <PlusIcon className='size-3' />
              </button>
            </div>

            <span className='text-foreground hidden w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums sm:block'>
              ${plant.price * qty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  const [plants, setPlants] = useState<Plant[]>(INITIAL);

  const isLast = plants.length <= 1;

  const onRemove = (id: string) => setPlants((prev) => prev.filter((plant) => plant.id !== id));

  const onQty = (id: string, delta: number) => {
    setPlants((currentPlants) => {
      const plant = currentPlants.find((currentPlant) => currentPlant.id === id);
      if (!plant) return currentPlants;

      const next = (plant.qty ?? 1) + delta;

      if (next < 1) {
        if (currentPlants.length <= 1) return currentPlants;
        return currentPlants.filter((currentPlant) => currentPlant.id !== id);
      }

      return currentPlants.map((currentPlant) =>
        currentPlant.id === id ? { ...currentPlant, qty: next } : currentPlant
      );
    });
  };

  const subtotal = plants.reduce((sum, plant) => sum + plant.price * (plant.qty ?? 1), 0);
  const shipping = Math.round(subtotal * SHIPPING_RATE);
  const total = subtotal + shipping;

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-4'>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-foreground text-base font-semibold'>Your cart</h2>
        <span className='text-muted-foreground text-xs tabular-nums'>{plants.length} items</span>
      </div>

      <div className='divide-border flex flex-col divide-y'>
        {plants.map((plant) => (
          <SwipeRow
            key={plant.id}
            isLast={isLast}
            plant={plant}
            onQty={onQty}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className='border-border flex flex-col gap-2 border-t pt-3'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>Subtotal</span>
          <span className='text-foreground font-mono tabular-nums'>${subtotal}</span>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>Shipping</span>
          <span className='text-foreground font-mono tabular-nums'>${shipping}</span>
        </div>
        <div className='border-border flex items-center justify-between border-t pt-2'>
          <span className='text-foreground text-sm font-medium'>Total</span>
          <span className='text-foreground font-mono text-lg font-bold tabular-nums'>${total}</span>
        </div>

        <button className='mt-1 w-full!' type='button'>
          Checkout
        </button>
      </div>
    </section>
  );
};

export default Demo;
