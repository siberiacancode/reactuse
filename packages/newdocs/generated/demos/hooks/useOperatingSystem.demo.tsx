'use client'

import type { OperatingSystem } from '@siberiacancode/reactuse';

import { useOperatingSystem } from '@siberiacancode/reactuse';
import { ChevronDownIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';

const OS_CONFIG = {
  macos: { label: 'macOS', arch: 'Apple Silicon', store: 'Mac App Store' },
  ios: { label: 'iOS', arch: '', store: 'App Store' },
  windows: { label: 'Windows', arch: 'x64', store: 'Microsoft Store' },
  android: { label: 'Android', arch: '', store: 'Google Play' },
  linux: { label: 'Linux', arch: 'x86_64', store: 'Snap Store' },
  undetermined: { label: 'Desktop', arch: '', store: 'all stores' }
} as const;

const OPTIONS: OperatingSystem[] = ['macos', 'windows', 'linux', 'ios', 'android'];

const Demo = () => {
  const operatingSystem = useOperatingSystem();
  const [os, setOs] = useState<OperatingSystem>(
    operatingSystem === 'undetermined' ? 'macos' : operatingSystem
  );

  const config = OS_CONFIG[os];

  return (
    <section className='flex w-full max-w-xl flex-col items-center gap-6 p-8 text-center'>
      <img alt='Juniors Bootcamp' className='h-14' src='/images/jb.png' />

      <div className='flex flex-col gap-3'>
        <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
          The best start to your career
        </h1>
        <p className='text-muted-foreground text-base'>
          Practice on tasks that mirror real work and level up your skills through experience.
        </p>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <div className='relative inline-flex'>
          <select
            className='hover:bg-accent! w-auto! border-transparent! bg-transparent! pr-7!'
            value={os}
            onChange={(event) => setOs(event.target.value as OperatingSystem)}
          >
            {OPTIONS.map((option) => (
              <option key={option} value={option}>
                {OS_CONFIG[option].label}
                {OS_CONFIG[option].arch && ` · ${OS_CONFIG[option].arch}`}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-1.5 size-4 -translate-y-1/2' />
        </div>

        <div className='flex items-center gap-2'>
          <button className='h-11 px-6 text-base' type='button'>
            Download
            <DownloadIcon className='size-4' />
          </button>

          <button className='h-11 px-6 text-base' data-variant='outline' type='button'>
            Get it on {config.store}
          </button>
        </div>
      </div>

      <div className='border-border bg-muted mt-2 aspect-video w-full overflow-hidden rounded-xl border'>
        <img
          alt='Juniors Bootcamp preview'
          className='size-full object-cover'
          src='PREVIEW_URL_HERE'
        />
      </div>
    </section>
  );
};

export default Demo;
