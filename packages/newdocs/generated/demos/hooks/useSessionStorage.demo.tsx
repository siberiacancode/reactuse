'use client'

import { useSessionStorage } from '@siberiacancode/reactuse';
import { ChevronDownIcon, LayoutGridIcon } from 'lucide-react';

const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'compact', label: 'Compact' }
];

const Demo = () => {
  const densitySessionStorage = useSessionStorage('reactuse-demo-density', 'comfortable');

  return (
    <section className='border-border flex min-w-0 w-full flex-col gap-2 rounded-xl border p-2'>
      <div className='flex w-full min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
          <LayoutGridIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='min-w-0 flex flex-col gap-0.5'>
            <span className='text-sm font-medium'>Layout density</span>
            <span className='text-muted-foreground text-xs'>Kept for this session only</span>
          </div>
        </div>

        <div className='relative w-full sm:w-auto'>
          <select
            className='w-full sm:min-w-44'
            value={densitySessionStorage.value ?? 'comfortable'}
            onChange={(event) => densitySessionStorage.set(event.target.value)}
          >
            {DENSITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
        </div>
      </div>
    </section>
  );
};

export default Demo;
