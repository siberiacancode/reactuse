import { cn, deepEqual } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [status, setStatus] = useState<'offline' | 'online'>('online');

  const savedUser = {
    name: 'Alex',
    profile: { status: 'online' }
  };
  const currentUser = {
    name: 'Alex',
    profile: { status }
  };
  const isEqual = deepEqual(savedUser, currentUser);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              isEqual ? 'bg-emerald-500/15 text-emerald-500' : 'bg-destructive/15 text-destructive'
            )}
          >
            {isEqual ? <CheckIcon className='size-5' /> : <XIcon className='size-5' />}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <span className='text-foreground text-sm font-semibold'>Alex</span>
            <span className='text-muted-foreground text-xs capitalize'>{status}</span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between gap-3 border-t pt-3'>
          <span className='text-muted-foreground text-xs'>
            {isEqual ? 'Matches saved profile' : 'Different from saved profile'}
          </span>
          <button
            data-size='sm'
            data-variant='outline'
            type='button'
            onClick={() => setStatus((current) => (current === 'online' ? 'offline' : 'online'))}
          >
            Set {status === 'online' ? 'offline' : 'online'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
