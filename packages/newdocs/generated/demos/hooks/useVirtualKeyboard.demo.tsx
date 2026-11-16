'use client'

import { useField, useVirtualKeyboard } from '@siberiacancode/reactuse';
import { SendIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const virtualKeyboard = useVirtualKeyboard();
  const messageField = useField('');

  const message = messageField.watch();

  if (!virtualKeyboard.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div
        className={cn(
          'bg-card border-border flex items-center gap-2 rounded-full border p-1.5 transition-all duration-200',
          virtualKeyboard.opened && 'border-ring ring-ring/50 ring-3'
        )}
      >
        <input
          className='flex-1 rounded-full! border-none! bg-transparent px-3 text-sm shadow-none! ring-0! outline-none'
          placeholder='Message…'
          {...messageField.register()}
        />
        <button
          aria-label='Send'
          className='flex size-9 shrink-0 items-center justify-center rounded-full!'
          disabled={!message.trim()}
          type='button'
          onClick={() => messageField.reset()}
        >
          <SendIcon className='size-4' />
        </button>
      </div>
    </section>
  );
};

export default Demo;
