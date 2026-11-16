'use client'

import { useLess } from '@siberiacancode/reactuse';

const Demo = () => {
  useLess();

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-3 p-6'>
      <div className='text-5xl'>🎉</div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-foreground text-sm font-semibold'>Surprise! It's a joke.</h2>
        <p className='text-muted-foreground text-xs'>
          Don't forget that development is fun — keep building, keep shipping ✨ Maybe you need
          check{' '}
          <a
            className='text-primary underline'
            href='/functions/hooks/useFul'
            rel='noreferrer'
            target='_blank'
          >
            useFul
          </a>{' '}
          hook.
        </p>
      </div>
    </section>
  );
};

export default Demo;
