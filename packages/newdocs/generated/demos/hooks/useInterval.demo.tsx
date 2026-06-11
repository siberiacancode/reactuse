'use client'

import { useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';

const GREETINGS = [
  'Hello',
  'Привет',
  'Hola',
  'Bonjour',
  'こんにちは',
  '你好',
  'Ciao',
  'Olá',
  'Hallo',
  'Salam'
];

const INTERVAL = 3000;

const Demo = () => {
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex((current) => (current + 1) % GREETINGS.length);
  }, INTERVAL);

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div key={index} className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
        <span className='text-foreground text-5xl font-bold tracking-tight'>
          {GREETINGS[index]}
        </span>
      </div>

      <div className='bg-muted h-1 w-32 overflow-hidden rounded-full'>
        <div
          key={index}
          style={{
            animation: `progress ${INTERVAL}ms linear`
          }}
          className='bg-foreground h-full origin-left'
        />
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Demo;
