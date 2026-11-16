'use client'

import { useLocalStorage } from '@siberiacancode/reactuse';
import { BellIcon, ChevronDownIcon } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'live', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'off', label: 'Off' }
];

const Demo = () => {
  const settingLocalStorage = useLocalStorage('reactuse-demo-notify', 'daily');

  return (
    <section className='border-border flex w-full max-w-sm min-w-0 flex-col gap-2 rounded-xl border p-2 md:max-w-md'>
      <div className='flex w-full min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
          <BellIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex min-w-0 flex-col gap-0.5'>
            <span className='text-sm font-medium'>Email notifications</span>
            <span className='text-muted-foreground text-xs'>How often you get updates</span>
          </div>
        </div>

        <div className='relative w-full sm:w-auto'>
          <select
            className='w-full sm:min-w-44'
            value={settingLocalStorage.value}
            onChange={(event) => settingLocalStorage.set(event.target.value)}
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
    </section>
  );
};

export default Demo;
