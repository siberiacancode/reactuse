---
title: useSpeechSynthesis
description: Hook that provides speech synthesis functionality
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781603339000
---

# useSpeechSynthesis

Hook that provides speech synthesis functionality

## Demo

```tsx
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
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useSpeechSynthesis
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/** The use speech synthesis status type */
export type UseSpeechSynthesisStatus = 'end' | 'init' | 'pause' | 'play';

/** The use speech synthesis options type */
export interface UseSpeechSynthesisOptions {
  /** Language for SpeechSynthesis */
  lang?: string;
  /** Gets and sets the pitch at which the utterance will be spoken at. */
  pitch?: number;
  /** Gets and sets the speed at which the utterance will be spoken at. */
  rate?: number;
  /** The text to be spoken */
  text?: string;
  /** Gets and sets the voice that will be used to speak the utterance. */
  voice?: SpeechSynthesisVoice | null;
  /** Gets and sets the volume that the utterance will be spoken at. */
  volume?: number;
}

/** The use speech synthesis return type */
export interface UseSpeechSynthesisReturn {
  /** Any error that occurred during speech synthesis. */
  error: SpeechSynthesisErrorEvent | undefined;
  /** Indicates if speech is currently playing. */
  playing: boolean;
  /** The current status of speech synthesis. */
  status: UseSpeechSynthesisStatus;
  /** Indicates if the SpeechSynthesis API is supported in the current environment. */
  supported: boolean;
  /** The SpeechSynthesisUtterance instance. */
  utterance: SpeechSynthesisUtterance | undefined;
  /** Function to pause speech synthesis. */
  pause: () => void;
  /** Function to resume speech synthesis. */
  resume: () => void;
  /** Function to start speech synthesis. */
  speak: (text?: string) => void;
  /** Function to stop speech synthesis. */
  stop: () => void;
  /** Function to toggle between play and pause. */
  toggle: (value?: boolean) => void;
}

/**
 * @name useSpeechSynthesis
 * @description - Hook that provides speech synthesis functionality
 * @category Browser
 * @usage low
 *
 * @browserapi SpeechSynthesis https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 *
 * @params {string} [options.text] - The text to be spoken
 * @params {string} [options.lang] - The language to be spoken
 * @params {number} [options.pitch] - The pitch to be spoken
 * @params {number} [options.rate] - The rate to be spoken
 * @params {SpeechSynthesisVoice} [options.voice] - The voice to be spoken
 * @params {number} [options.volume] - The volume to be spoken
 * @returns {UseSpeechSynthesisReturn} An object containing the speech synthesis state and control methods
 *
 * @example
 * const { supported, playing, status, utterance, error, stop, toggle, speak, resume, pause } = useSpeechSynthesis();
 */
export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && !!window.speechSynthesis;

  const { text = '', lang = 'en-US', pitch = 1, rate = 1, voice = null, volume = 1 } = options;

  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<UseSpeechSynthesisStatus>('init');
  const [error, setError] = useState<SpeechSynthesisErrorEvent>();

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();

  const bindSpeechSynthesisUtterance = (speechSynthesisUtterance: SpeechSynthesisUtterance) => {
    speechSynthesisUtterance.lang = lang;
    speechSynthesisUtterance.pitch = pitch;
    speechSynthesisUtterance.rate = rate;
    speechSynthesisUtterance.volume = volume;
    speechSynthesisUtterance.voice = voice;

    speechSynthesisUtterance.onstart = () => {
      setPlaying(true);
      setStatus('play');
    };

    speechSynthesisUtterance.onpause = () => {
      setPlaying(false);
      setStatus('pause');
    };

    speechSynthesisUtterance.onresume = () => {
      setPlaying(true);
      setStatus('play');
    };

    speechSynthesisUtterance.onend = () => {
      setPlaying(false);
      setStatus('end');
    };

    speechSynthesisUtterance.onerror = (event) => {
      setPlaying(false);
      setError(event);
    };
  };

  useEffect(() => {
    if (!supported) return;

    const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);

    bindSpeechSynthesisUtterance(speechSynthesisUtterance);
    setUtterance(speechSynthesisUtterance);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [
    text,
    lang,
    pitch,
    rate,
    volume,
    voice?.default,
    voice?.lang,
    voice?.localService,
    voice?.name,
    voice?.voiceURI
  ]);

  const speak = (text?: string) => {
    if (!supported) return;

    let target = utterance;

    if (text) {
      target = new SpeechSynthesisUtterance(text);
      bindSpeechSynthesisUtterance(target);
      setUtterance(target);
    }

    window.speechSynthesis?.cancel();
    if (target) window.speechSynthesis?.speak(target);
    setPlaying(true);
  };

  const stop = () => {
    if (!supported) return;

    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const toggle = (value = !playing) => {
    if (!supported) return;

    if (value) {
      window.speechSynthesis?.resume();
    } else {
      window.speechSynthesis?.pause();
    }
    setPlaying(value);
  };

  const resume = () => {
    setPlaying(true);
    window.speechSynthesis?.resume();
  };

  const pause = () => {
    setPlaying(false);
    window.speechSynthesis?.pause();
  };

  return {
    supported,
    playing,
    status,
    utterance,
    error,
    stop,
    toggle,
    speak,
    resume,
    pause
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, playing, status, utterance, error, stop, toggle, speak, resume, pause } = useSpeechSynthesis();
```

## Type Declarations

```tsx
export type UseSpeechSynthesisStatus = 'end' | 'init' | 'pause' | 'play';

export interface UseSpeechSynthesisOptions {
  /** Language for SpeechSynthesis */
  lang?: string;
  /** Gets and sets the pitch at which the utterance will be spoken at. */
  pitch?: number;
  /** Gets and sets the speed at which the utterance will be spoken at. */
  rate?: number;
  /** The text to be spoken */
  text?: string;
  /** Gets and sets the voice that will be used to speak the utterance. */
  voice?: SpeechSynthesisVoice | null;
  /** Gets and sets the volume that the utterance will be spoken at. */
  volume?: number;
}

export interface UseSpeechSynthesisReturn {
  /** Any error that occurred during speech synthesis. */
  error: SpeechSynthesisErrorEvent | undefined;
  /** Indicates if speech is currently playing. */
  playing: boolean;
  /** The current status of speech synthesis. */
  status: UseSpeechSynthesisStatus;
  /** Indicates if the SpeechSynthesis API is supported in the current environment. */
  supported: boolean;
  /** The SpeechSynthesisUtterance instance. */
  utterance: SpeechSynthesisUtterance | undefined;
  /** Function to pause speech synthesis. */
  pause: () => void;
  /** Function to resume speech synthesis. */
  resume: () => void;
  /** Function to start speech synthesis. */
  speak: (text?: string) => void;
  /** Function to stop speech synthesis. */
  stop: () => void;
  /** Function to toggle between play and pause. */
  toggle: (value?: boolean) => void;
}
```

## API

### Returns

`UseSpeechSynthesisReturn` - An object containing the speech synthesis state and control methods