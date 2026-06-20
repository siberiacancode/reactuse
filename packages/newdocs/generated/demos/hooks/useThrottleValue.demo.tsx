'use client'

import { useThrottleState } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const Demo = () => {
  const [text, setText] = useState('');
  const [typing, setTyping] = useThrottleState(false, 1500);
  const silenceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onChange = (value: string) => {
    setText(value);
    setTyping(true);

    clearTimeout(silenceRef.current);
    silenceRef.current = setTimeout(setTyping, 2000, false);
  };

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='border-border bg-card flex h-80 flex-col overflow-hidden rounded-xl border'>
        <div className='border-border flex items-center gap-2.5 border-b px-4 py-3'>
          <div className='relative'>
            <div className='bg-muted flex size-9 items-center justify-center rounded-full text-sm font-medium'>
              D
            </div>
            <span className='border-card absolute right-0 bottom-0 size-2.5 rounded-full border-2 bg-green-500' />
          </div>
          <div className='flex flex-col leading-tight'>
            <span className='text-foreground text-sm font-medium'>debabin</span>
            <span className='text-muted-foreground text-xs'>{typing ? 'typing…' : 'online'}</span>
          </div>
        </div>

        <div className='flex flex-1 flex-col justify-end gap-2 p-4'>
          <div className='bg-muted text-foreground self-start rounded-2xl rounded-bl-md px-3 py-2 text-sm'>
            Hey! How's the new hook coming along?
          </div>

          {typing && (
            <div className='bg-muted flex items-center gap-1 self-start rounded-2xl rounded-bl-md px-3.5 py-3'>
              <span className='bg-muted-foreground/60 size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]' />
              <span className='bg-muted-foreground/60 size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]' />
              <span className='bg-muted-foreground/60 size-1.5 animate-bounce rounded-full' />
            </div>
          )}
        </div>

        <div className='border-border border-t p-3'>
          <input
            className='w-full!'
            placeholder='Type a message…'
            type='text'
            value={text}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default Demo;
