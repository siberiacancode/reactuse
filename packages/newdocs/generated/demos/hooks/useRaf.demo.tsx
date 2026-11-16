'use client'

import { useRaf } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const Demo = () => {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const elapsedRef = useRef(0);

  useRaf(({ delta }) => {
    framesRef.current += 1;
    elapsedRef.current += delta;

    if (elapsedRef.current >= 1000) {
      setFps(Math.round((framesRef.current * 1000) / elapsedRef.current));
      framesRef.current = 0;
      elapsedRef.current = 0;
    }
  });

  return (
    <section className='flex flex-col items-center gap-2 p-8'>
      <span className='text-foreground font-mono text-6xl font-bold tabular-nums'>{fps}</span>
      <span className='text-muted-foreground text-sm'>frames per second</span>
    </section>
  );
};

export default Demo;
