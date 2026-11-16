'use client'

import { useVibrate } from '@siberiacancode/reactuse';
import { PlayIcon } from 'lucide-react';

const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..'
};

const DOT = 120;
const DASH = 360;
const GAP = 120;
const LETTER_GAP = 360;
const WORD_GAP = 840;

const PHRASE = 'HELLO WORLD';

const toPattern = (text: string): number[] => {
  const pattern: number[] = [];

  text
    .toUpperCase()
    .split(' ')
    .forEach((word, wordIndex, words) => {
      word.split('').forEach((char, charIndex, chars) => {
        const code = MORSE[char];
        if (!code) return;

        code.split('').forEach((symbol, symbolIndex) => {
          pattern.push(symbol === '.' ? DOT : DASH);
          if (symbolIndex < code.length - 1) pattern.push(GAP);
        });

        if (charIndex < chars.length - 1) pattern.push(LETTER_GAP);
      });

      if (wordIndex < words.length - 1) pattern.push(WORD_GAP);
    });

  return pattern;
};

const Demo = () => {
  const vibrate = useVibrate(toPattern(PHRASE));

  if (!vibrate.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col items-center gap-5 p-6 text-center'>
      <div className='flex flex-col gap-1.5'>
        <h3 className='text-foreground text-lg font-semibold'>Feel it in Morse</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Morse code turns letters into short and long signals — dots and dashes. Tap play to feel
          the phrase buzz out on your device.
        </p>
      </div>

      <button
        className='flex h-10! w-full items-center justify-center gap-2 rounded-2xl! text-base font-semibold'
        type='button'
        onClick={() => vibrate.trigger()}
      >
        <PlayIcon className='size-5 fill-current' />
        Play “Hello world”
      </button>
    </section>
  );
};

export default Demo;
