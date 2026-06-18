'use client'

import { useStorage } from '@siberiacancode/reactuse';
import { SaveIcon } from 'lucide-react';

const Demo = () => {
  const autoSaveStorage = useStorage('reactuse-demo-autosave', true);

  return (
    <section className='border-border flex min-w-md flex-col gap-2 rounded-xl border p-2'>
      <div className='flex w-full max-w-md items-center justify-between gap-4 p-4'>
        <div className='flex items-center gap-3'>
          <SaveIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-medium'>Auto-save</span>
            <span className='text-muted-foreground text-xs'>
              Automatically save your changes as you work
            </span>
          </div>
        </div>

        <input
          checked={autoSaveStorage.value}
          role='switch'
          type='checkbox'
          onChange={(event) => autoSaveStorage.set(event.target.checked)}
        />
      </div>
    </section>
  );
};

export default Demo;
