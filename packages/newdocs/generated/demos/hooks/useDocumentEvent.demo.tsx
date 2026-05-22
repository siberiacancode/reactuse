'use client'

import { useCounter, useDocumentEvent } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const counter = useCounter();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useDocumentEvent('click', (event) => {
    counter.inc();
    setLastPosition({ x: event.clientX, y: event.clientY });
  });

  return (
    <section className='flex flex-col items-center gap-4 p-8 select-none'>
      <span className='text-foreground font-mono text-6xl font-semibold tabular-nums'>
        {String(counter.value).padStart(3, '0')}
      </span>

      <p className='text-muted-foreground text-sm'>Click anywhere on the page</p>

      <span className='text-muted-foreground font-mono text-xs tracking-wider tabular-nums'>
        {lastPosition.x}, {lastPosition.y}
      </span>
    </section>
  );
};

export default Demo;
