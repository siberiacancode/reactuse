'use client'

import { useKeyboard } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const TARGET = 'react';

const Demo = () => {
  const [input, setInput] = useState('');

  useKeyboard((event) => {
    event.preventDefault();

    if (event.key === 'Backspace') {
      setInput((current) => current.slice(0, -1));
      return;
    }

    if (event.key.length !== 1 || !/\p{L}/u.test(event.key)) return;
    if (input.length >= TARGET.length) return;
    setInput((current) => current + event.key.toLowerCase());
  });

  const cells = Array.from({ length: TARGET.length }, (_, index) => {
    const char = input[index];
    const expected = TARGET[index];
    const filled = !!char;
    const correct = filled && char === expected;
    return { char, expected, filled, correct };
  });

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div className='flex flex-col items-center gap-1'>
        <span className='text-muted-foreground text-[10px] tracking-[0.2em] uppercase'>
          Type the word
        </span>
        <span className='text-foreground font-mono text-4xl font-bold tracking-[0.4em] uppercase'>
          {TARGET}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn(
              'flex size-12 items-center justify-center rounded-lg border-2 font-mono text-xl font-bold uppercase transition-colors',
              !cell.filled && 'border-border bg-card text-muted-foreground',
              cell.filled &&
                cell.correct &&
                'border-green-500 bg-green-500/10 text-green-600 dark:text-green-500',
              cell.filled &&
                !cell.correct &&
                'border-destructive bg-destructive/10 text-destructive'
            )}
          >
            {cell.char ?? ''}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
