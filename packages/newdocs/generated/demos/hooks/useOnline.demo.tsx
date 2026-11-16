'use client'

import { useOnline } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const Demo = () => {
  const online = useOnline();

  return (
    <section className='flex w-full justify-center p-4'>
      <span className='border-border bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium'>
        <span className={cn('size-2 rounded-full', online ? 'bg-green-500' : 'bg-destructive')} />
        {online ? 'Online' : 'Offline'}
      </span>
    </section>
  );
};

export default Demo;
