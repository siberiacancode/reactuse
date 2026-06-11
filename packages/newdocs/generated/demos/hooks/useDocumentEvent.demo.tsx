'use client'

import { useCounter, useDocumentEvent } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const cookies = useCounter();
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [popId, setPopId] = useState(0);

  useDocumentEvent('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element) || !target.closest('[data-cookie-target]')) return;

    cookies.inc();

    const id = popId;
    setPopId((value) => value + 1);
    setPops((current) => [...current, { id, x: event.clientX, y: event.clientY }]);

    setTimeout(() => {
      setPops((current) => current.filter((pop) => pop.id !== id));
    }, 800);
  });

  return (
    <section className='flex flex-col items-center gap-4 p-8 select-none'>
      <span
        data-cookie-target
        className='cursor-pointer text-7xl transition-transform duration-100 active:scale-95'
      >
        🍪
      </span>

      <div className='flex flex-col items-center gap-1'>
        <span className='text-foreground font-mono text-5xl font-semibold tabular-nums'>
          {cookies.value.toLocaleString()}
        </span>
        <span className='text-muted-foreground text-xs tracking-wider uppercase'>cookies</span>
      </div>

      {pops.map((pop) => (
        <span
          key={pop.id}
          style={{
            left: pop.x,
            top: pop.y,
            animation: 'yummy-cookie-pop 800ms ease-out forwards'
          }}
          className='pointer-events-none fixed z-50 text-2xl'
        >
          +1
        </span>
      ))}

      <style>{`
        @keyframes yummy-cookie-pop {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          20% { transform: translate(-50%, -60%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -120%) scale(0.9); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Demo;
