'use client'

import { useCookie } from '@siberiacancode/reactuse';
import { BellIcon, ChevronDownIcon } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'live', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'off', label: 'Off' }
];

const Demo = () => {
  const cookie = useCookie('notify', 'daily');

  return (
    <section className='flex min-w-md flex-col gap-2 p-4'>
      <div className='flex w-full max-w-md items-start justify-between gap-4 rounded-xl border p-4'>
        <div className='flex items-center gap-3'>
          <BellIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-medium'>Email notifications</span>
            <span className='text-muted-foreground text-xs'>How often you get updates</span>
          </div>
        </div>

        <div className='relative'>
          <select
            value={cookie.value ?? 'daily'}
            onChange={(event) => cookie.set(event.target.value)}
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>
        Saved as <code>notify={cookie.value ?? 'daily'}</code> cookie.
      </p>
    </section>
  );
};

export default Demo;
