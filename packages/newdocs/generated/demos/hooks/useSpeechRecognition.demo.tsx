'use client'

import { useSpeechRecognition } from '@siberiacancode/reactuse';
import { MicIcon, SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const [query, setQuery] = useState('');
  const [silent, setSilent] = useState(false);

  const listeningRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const speechRecognition = useSpeechRecognition({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    onResult: (event) => {
      const result = event.results[event.results.length - 1];
      if (!result.isFinal) return;

      setQuery((prev) => `${prev} ${result[0].transcript}`.trim());

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setSilent(false);
      silenceTimerRef.current = setTimeout(setSilent, 2000, true);
    }
  });

  const recognition = speechRecognition.recognition;

  const onStart = () => {
    listeningRef.current = true;
    if (recognition) {
      recognition.onend = () => {
        if (listeningRef.current) recognition.start();
        else {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          setSilent(false);
        }
      };
    }
    speechRecognition.start();
    setSilent(false);
    silenceTimerRef.current = setTimeout(setSilent, 2000, true);
  };

  const onStop = () => {
    listeningRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setSilent(false);
    speechRecognition.stop();
  };

  if (!speechRecognition.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col gap-2 p-4'>
      <span className='text-muted-foreground text-xs'>Voice search · English (US)</span>

      <div className='relative'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2' />
        <input
          className='h-11! rounded-full! pr-12! pl-10!'
          placeholder={speechRecognition.listening ? 'Listening…' : 'Search or speak'}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          aria-label={speechRecognition.listening ? 'Stop' : 'Search by voice'}
          className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full!'
          data-size='icon-sm'
          data-variant={speechRecognition.listening ? 'default' : 'ghost'}
          type='button'
          onClick={() => (speechRecognition.listening ? onStop() : onStart())}
        >
          <MicIcon className={cn('size-4', speechRecognition.listening && 'animate-pulse')} />
        </button>
      </div>

      {silent && (
        <p className='text-muted-foreground min-h-4 text-xs'>Can't hear you — try speaking up</p>
      )}
    </section>
  );
};

export default Demo;
