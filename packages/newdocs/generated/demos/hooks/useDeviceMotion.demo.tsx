'use client'

import { useDeviceMotion } from '@siberiacancode/reactuse';
import { SmartphoneIcon } from 'lucide-react';

const CIRCLE_SIZE = 200;
const BUBBLE_SIZE = 36;
const MAX_OFFSET = CIRCLE_SIZE / 2 - BUBBLE_SIZE / 2 - 8;
const GRAVITY = 9.8;
const LEVEL_THRESHOLD = 0.5;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Demo = () => {
  const motion = useDeviceMotion({ delay: 100 });

  const x = motion.accelerationIncludingGravity.x;
  const y = motion.accelerationIncludingGravity.y;

  if (x === null || y === null) {
    return (
      <section className='flex w-full max-w-sm flex-col items-center p-4'>
        <div className='bg-muted/40 flex flex-col items-center gap-3 rounded-2xl p-8 text-center'>
          <SmartphoneIcon className='text-muted-foreground size-10' />
          <p className='text-sm font-medium'>Device motion not supported</p>
          <p className='text-muted-foreground text-xs'>
            Open this page on a mobile device to use the spirit level.
          </p>
        </div>
      </section>
    );
  }

  const offsetX = clamp((-x / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);
  const offsetY = clamp((y / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);

  const tiltX = ((-x / GRAVITY) * 90).toFixed(1);
  const tiltY = ((y / GRAVITY) * 90).toFixed(1);

  const isLevel = Math.abs(x) < LEVEL_THRESHOLD && Math.abs(y) < LEVEL_THRESHOLD;

  return (
    <section className='flex w-full max-w-sm flex-col items-center gap-5 p-4'>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h3>Spirit level</h3>
        <p className='text-muted-foreground text-sm'>
          Tilt your device — the bubble follows gravity.
        </p>
      </div>

      <div
        className='border-border bg-muted/30 relative rounded-full border-2'
        style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
      >
        <div className='bg-border absolute top-1/2 left-0 h-px w-full -translate-y-1/2' />
        <div className='bg-border absolute top-0 left-1/2 h-full w-px -translate-x-1/2' />

        <div
          style={{
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            marginLeft: -BUBBLE_SIZE / 2,
            marginTop: -BUBBLE_SIZE / 2
          }}
          className='border-foreground/40 absolute top-1/2 left-1/2 rounded-full border-2'
        />

        <div
          style={{
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            marginLeft: -BUBBLE_SIZE / 2,
            marginTop: -BUBBLE_SIZE / 2,
            backgroundColor: isLevel ? 'oklch(0.65 0.15 160)' : 'oklch(0.55 0.18 250)',
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          className='absolute top-1/2 left-1/2 rounded-full transition-transform duration-100 ease-out'
        />
      </div>

      <div className='flex gap-6 text-sm'>
        <div className='flex flex-col items-center'>
          <span className='text-muted-foreground text-xs'>Tilt X</span>
          <code>{tiltX}°</code>
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-muted-foreground text-xs'>Tilt Y</span>
          <code>{tiltY}°</code>
        </div>
      </div>
    </section>
  );
};

export default Demo;
