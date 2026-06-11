'use client'

import { useCssVar } from '@siberiacancode/reactuse';
import { ChevronDownIcon } from 'lucide-react';
import { useRef } from 'react';

const ACCENT_COLORS = [
  { value: 'oklch(0.55 0.18 250)', label: 'Blue' },
  { value: 'oklch(0.55 0.22 300)', label: 'Violet' },
  { value: 'oklch(0.65 0.22 0)', label: 'Pink' },
  { value: 'oklch(0.65 0.18 50)', label: 'Orange' },
  { value: 'oklch(0.65 0.15 160)', label: 'Green' }
];

const RADIUS_OPTIONS = [
  { value: '0rem', label: 'None' },
  { value: '0.3rem', label: 'Small' },
  { value: '0.625rem', label: 'Default' },
  { value: '1rem', label: 'Large' },
  { value: '1.5rem', label: 'Extra large' }
];

const PORTFOLIO = [
  { label: 'USD', amount: 12450, achieved: 78, target: 16000 },
  { label: 'EUR', amount: 8230, achieved: 41, target: 20000 }
];

const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);

const Demo = () => {
  const containerRef = useRef<HTMLElement>(null);

  const primary = useCssVar(containerRef, '--demo-primary', 'oklch(0.55 0.18 250)');
  const radius = useCssVar(containerRef, '--demo-radius', '0.625rem');

  const activeColor =
    ACCENT_COLORS.find((color) => color.value === primary.value) ?? ACCENT_COLORS[0];
  const activeRadius =
    RADIUS_OPTIONS.find((option) => option.value === radius.value) ?? RADIUS_OPTIONS[2];

  return (
    <section ref={containerRef} className='flex flex-col gap-5 p-4'>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between py-3'>
          <div className='flex flex-col'>
            <span className='text-muted-foreground text-xs'>Primary color</span>
            <span className='text-sm font-medium'>{activeColor.label}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            {ACCENT_COLORS.map((color) => (
              <div
                key={color.value}
                style={{
                  backgroundColor: color.value,
                  outline: primary.value === color.value ? `2px solid ${color.value}` : 'none',
                  outlineOffset: '2px'
                }}
                className='size-4 cursor-pointer rounded-full transition-transform hover:scale-110'
                onClick={() => primary.set(color.value)}
              />
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between py-3'>
          <div className='flex flex-col'>
            <span className='text-muted-foreground text-xs'>Radius</span>
            <span className='text-sm font-medium'>{activeRadius.label}</span>
          </div>
          <div className='relative'>
            <select
              value={radius.value ?? '0.625rem'}
              onChange={(event) => radius.set(event.target.value)}
            >
              {RADIUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
          </div>
        </div>
      </div>

      <div className='bg-card flex flex-col overflow-hidden rounded-[var(--demo-radius)] border'>
        <div className='flex flex-col gap-5 p-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <h4>Wallet balance</h4>
              <p className='text-muted-foreground text-sm'>Active currencies for 2026</p>
            </div>
            <button
              className='rounded-[var(--demo-radius)]! bg-[var(--demo-primary)]! text-white'
              type='button'
            >
              Add money
            </button>
          </div>

          <div className='flex flex-col gap-3'>
            {PORTFOLIO.map((item) => (
              <div
                key={item.label}
                className='bg-muted/40 flex flex-col gap-2 rounded-[var(--demo-radius)] bg-[var(--demo-primary)] p-4'
              >
                <span className='text-muted-foreground text-xs tracking-widest uppercase'>
                  {item.label}
                </span>
                <div className='flex items-baseline justify-between'>
                  <span className='text-3xl font-semibold tracking-tight'>
                    {formatMoney(item.amount, item.label)}
                  </span>
                </div>
                <div className='bg-background/60 ип h-1 w-full overflow-hidden rounded-full'>
                  <div
                    style={{
                      width: `${item.achieved}%`
                    }}
                    className='h-full rounded-full bg-[var(--demo-primary)] transition-all'
                  />
                </div>
                <div className='text-muted-foreground flex items-center justify-between text-xs'>
                  <span>{item.achieved}% of target</span>
                  <span className='font-medium'>{formatMoney(item.target, item.label)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-muted/30 text-muted-foreground border-t px-5 py-3 text-xs'>
          Conversion rates update every hour from your linked bank account.
        </div>
      </div>
    </section>
  );
};

export default Demo;
