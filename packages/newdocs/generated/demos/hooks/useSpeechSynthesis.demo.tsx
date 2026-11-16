'use client'

import { useSpeechSynthesis } from '@siberiacancode/reactuse';
import { PlayIcon, SquareIcon } from 'lucide-react';

const ARTICLE = {
  title: 'Why hooks won',
  text: 'Hooks changed how we write React. Instead of scattering logic across lifecycle methods, you compose small, focused pieces of behavior and reuse them anywhere. A good hook hides the wiring and gives you back exactly what you need — nothing more, nothing less.'
};

const Demo = () => {
  const speechSynthesis = useSpeechSynthesis({ text: ARTICLE.text });

  if (!speechSynthesis.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div data-slot='card'>
        <div data-slot='card-header'>
          <div data-slot='card-title'>{ARTICLE.title}</div>
        </div>

        <div className='flex flex-col gap-4' data-slot='card-content'>
          <p className='text-muted-foreground text-sm leading-relaxed'>{ARTICLE.text}</p>

          <div data-orientation='horizontal' data-slot='separator' />

          <div className='flex items-center gap-3'>
            <button
              aria-label={speechSynthesis.playing ? 'Stop' : 'Listen'}
              className='rounded-full!'
              data-size='icon'
              data-variant='secondary'
              type='button'
              onClick={() =>
                speechSynthesis.playing ? speechSynthesis.stop() : speechSynthesis.speak()
              }
            >
              {speechSynthesis.playing ? (
                <SquareIcon className='size-4' />
              ) : (
                <PlayIcon className='size-4' />
              )}
            </button>

            <div className='flex flex-col leading-tight'>
              <span className='text-foreground text-sm font-medium'>
                {speechSynthesis.playing ? 'Playing…' : 'Listen to this article'}
              </span>
              <span className='text-muted-foreground text-xs'>
                Prefer to listen? Press play to hear it.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
