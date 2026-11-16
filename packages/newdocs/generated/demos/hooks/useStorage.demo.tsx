'use client'

import { useStorage } from '@siberiacancode/reactuse';
import { SaveIcon } from 'lucide-react';

const Demo = () => {
  const autoSaveStorage = useStorage('reactuse-demo-autosave', true);

  return (
    <section className='border-border flex w-full max-w-sm min-w-0 flex-col gap-2 rounded-xl border p-2 md:max-w-md'>
      <div className='flex w-full min-w-0 items-center justify-between gap-4 p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <SaveIcon className='text-muted-foreground size-6 shrink-0' />
          <div className='flex min-w-0 flex-col gap-0.5'>
            <span className='text-sm font-medium'>Auto-save</span>
            <span className='text-muted-foreground text-xs break-words'>
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
