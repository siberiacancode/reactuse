'use client'

import { useScript } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';
import { useRef } from 'react';

const CONFETTI_SRC =
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

const Demo = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const status = useScript(CONFETTI_SRC);

  const onCelebrate = () => {
    const confetti = (window as typeof window & { confetti?: (options: object) => void }).confetti;
    if (!confetti || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 80,
      startVelocity: 35,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      }
    });
  };

  return (
    <section className='flex flex-col items-center p-12'>
      <button
        ref={buttonRef}
        className='h-14! rounded-full! px-8!'
        data-variant='outline'
        disabled={status !== 'ready'}
        type='button'
        onClick={onCelebrate}
      >
        {status === 'ready' ? (
          <>🎉 Celebrate</>
        ) : (
          <>
            <Loader2Icon className='size-5 animate-spin' />
            Loading…
          </>
        )}
      </button>
    </section>
  );
};

export default Demo;
