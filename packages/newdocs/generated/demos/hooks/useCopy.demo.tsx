'use client'

import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

const COMMANDS: Record<PackageManager, string> = {
  pnpm: 'pnpm add @siberiacancode/reactuse',
  npm: 'npm install @siberiacancode/reactuse',
  yarn: 'yarn add @siberiacancode/reactuse',
  bun: 'bun add @siberiacancode/reactuse'
};

const TABS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const Demo = () => {
  const { copy, copied } = useCopy();
  const [selectedManager, setSelectedManager] = useState<PackageManager>('pnpm');

  return (
    <section className='flex w-full max-w-md flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h3>Installation</h3>
        <p className='text-muted-foreground text-sm'>
          Add <b>reactuse</b> to your project with your preferred package manager.
        </p>
      </div>

      <div data-slot='tabs'>
        <div className='mb-3' data-slot='tabs-list'>
          {TABS.map((tab) => (
            <button
              key={tab}
              data-state={cn(selectedManager === tab && 'active')}
              data-variant='tabs-trigger'
              type='button'
              onClick={() => setSelectedManager(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div data-slot='tabs-content'>
          <div className='relative flex items-center gap-2'>
            <input
              readOnly
              className='text-md! h-12! rounded-full! px-3!'
              value={COMMANDS[selectedManager]}
            />
            <button
              className='absolute top-2 right-2 h-8!'
              disabled={copied}
              type='button'
              onClick={() => copy(COMMANDS[selectedManager])}
            >
              {copied ? (
                <>
                  <CheckIcon className='size-4' /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className='size-4' /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
