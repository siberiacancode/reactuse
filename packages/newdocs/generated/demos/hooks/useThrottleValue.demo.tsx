'use client'

import type { MouseEvent } from 'react';

import { useThrottleValue } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const hslToHex = (h: number, s: number, l: number) => {
  const lightness = l / 100;
  const a = (s * Math.min(lightness, 1 - lightness)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const Demo = () => {
  const [hsl, setHsl] = useState({ h: 210, l: 50 });
  const draggingRef = useRef(false);

  const throttledHsl = useThrottleValue(hsl, 120);
  const hex = hslToHex(throttledHsl.h, 70, throttledHsl.l);

  const pick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    setHsl({
      h: Math.round((x / rect.width) * 360),
      l: Math.round(90 - (y / rect.height) * 80)
    });
  };

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    pick(event);
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (draggingRef.current) pick(event);
  };

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div data-slot='card'>
        <div data-slot='card-header'>
          <div data-slot='card-title'>Color picker</div>
          <div data-slot='card-description'>Drag across the palette to pick a color.</div>
        </div>

        <div className='flex flex-col gap-4' data-slot='card-content'>
          <div
            style={{
              background:
                'linear-gradient(to bottom, hsl(0,0%,90%), transparent, hsl(0,0%,10%)), linear-gradient(to right, hsl(0,70%,50%), hsl(60,70%,50%), hsl(120,70%,50%), hsl(180,70%,50%), hsl(240,70%,50%), hsl(300,70%,50%), hsl(360,70%,50%))'
            }}
            className='relative h-44 w-full cursor-crosshair overflow-hidden rounded-lg select-none'
            onMouseDown={onMouseDown}
            onMouseLeave={() => (draggingRef.current = false)}
            onMouseMove={onMouseMove}
            onMouseUp={() => (draggingRef.current = false)}
          >
            <div
              style={{
                left: `${(hsl.h / 360) * 100}%`,
                top: `${((90 - hsl.l) / 80) * 100}%`,
                background: hslToHex(hsl.h, 70, hsl.l)
              }}
              className='pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md'
            />
          </div>

          <div className='flex items-center gap-3'>
            <div
              className='border-border size-11 shrink-0 rounded-lg border transition-colors duration-100'
              style={{ background: hex }}
            />
            <div className='flex flex-1 flex-col leading-tight'>
              <span className='text-muted-foreground text-xs'>Selected</span>
              <span className='text-foreground font-mono text-base font-semibold tabular-nums'>
                {hex}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
