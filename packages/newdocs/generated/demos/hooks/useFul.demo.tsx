'use client'

import { useFul } from '@siberiacancode/reactuse';

const Demo = () => {
  useFul();

  return (
    <section className='demo-ui flex w-full max-w-md flex-col items-center gap-3 p-6'>
      <div className='text-5xl'>🎉</div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-foreground text-sm font-semibold'>Surprise! It's a joke.</h2>
        <p className='text-muted-foreground text-xs'>
          Check your console — <code className='text-foreground'>useFul</code> is just here to
          remind you it shouldn't be in production.
        </p>
      </div>
    </section>
  );
};

export default Demo;
