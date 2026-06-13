'use client'

import { useRerender } from '@siberiacancode/reactuse';

const Demo = () => {
  const rerender = useRerender();
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <span className='text-foreground font-mono text-5xl font-bold tabular-nums'>{time}</span>

      <button data-variant='outline' type='button' onClick={rerender}>
        Refresh
      </button>
    </section>
  );
};

export default Demo;
