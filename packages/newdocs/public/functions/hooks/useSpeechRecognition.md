---
title: useSpeechRecognition
description: Hook that provides a streamlined interface for incorporating speech-to-text functionality
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1786111973000
---

# useSpeechRecognition

Hook that provides a streamlined interface for incorporating speech-to-text functionality

## Demo

```tsx
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
      <span className='text-muted-foreground text-xs'>Voice search use English (US)</span>

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
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useSpeechRecognition
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/** The use speech recognition hook options type */
interface UseSpeechRecognitionOptions {
  /** If true, recognition continues even after pauses in speech. Default is false */
  continuous?: SpeechRecognition['continuous'];
  /** A list of grammar rules */
  grammars?: SpeechRecognition['grammars'];
  /** If true, interim (non-final) results are provided as the user speaks */
  interimResults?: SpeechRecognition['interimResults'];
  /** The language in which recognition should occur. Must be a valid BCP 47 language tag (e.g., "en-US", "ru-RU") */
  language?: SpeechRecognition['lang'];
  /** The maximum number of alternative transcripts returned for a given recognition result. Must be a positive integer */
  maxAlternatives?: SpeechRecognition['maxAlternatives'];
  /** Callback invoked when speech recognition ends */
  onEnd?: () => void;
  /** Callback invoked when an error occurs during recognition */
  onError?: (error: SpeechRecognitionErrorEvent) => void;
  /** Callback invoked when recognition produces a result */
  onResult?: (event: SpeechRecognitionEvent) => void;
  /** Callback invoked when speech recognition starts */
  onStart?: () => void;
}

/** The return type of the useSpeechRecognition hook. */
interface UseSpeechRecognitionReturn {
  /** The error state */
  error: SpeechRecognitionErrorEvent | null;
  /** The final transcript */
  final: boolean;
  /** Whether the hook is currently listening for speech */
  listening: boolean;
  /** The speech recognition instance */
  recognition?: SpeechRecognition;
  /** Whether the current browser supports the Web Speech API */
  supported: boolean;
  /** The current transcript */
  transcript: string;
  /** Immediately interrupts speech recognition without a final result (will not trigger `onResult`). */
  abort: () => void;
  /** Begins speech recognition */
  start: () => void;
  /** Ends speech recognition, finalizing results (will trigger `onResult`) */
  stop: () => void;
  /** Toggles the listening state */
  toggle: (value?: boolean) => void;
}

export const getSpeechRecognition = () =>
  window?.SpeechRecognition ?? window?.webkitSpeechRecognition;

/**
 * @name useSpeechRecognition
 * @description - Hook that provides a streamlined interface for incorporating speech-to-text functionality
 * @category Browser
 * @usage low
 *
 * @browserapi window.SpeechRecognition https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 *
 * @param {boolean} [options.continuous=false] Whether recognition should continue after pauses
 * @param {boolean} [options.interimResults=false] Whether interim results should be provided
 * @param {string} [options.language="en-US"] The language for recognition, as a valid BCP 47 tag
 * @param {number} [options.maxAlternatives=1] The maximum number of alternative transcripts to return
 * @param {SpeechGrammarList} [options.grammars] A list of grammar rules
 * @param {() => void} [options.onStart] Callback invoked when speech recognition starts
 * @param {() => void} [options.onEnd] Callback invoked when speech recognition ends
 * @param {(error: SpeechRecognitionErrorEvent) => void} [options.onError] Callback invoked when an error occurs during recognition
 * @param {(event: SpeechRecognitionEvent) => void} [options.onResult] Callback invoked when recognition produces a result
 * @returns {UseSpeechRecognitionReturn} An object containing the speech recognition functionality
 *
 * @example
 * const { supported, value, recognition, listening, error, start, stop, abort, toggle  } = useSpeechRecognition();
 */
export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const supported = typeof window !== 'undefined' && !!getSpeechRecognition();

  const {
    continuous = false,
    interimResults = false,
    language = 'en-US',
    grammars,
    maxAlternatives = 1,
    onStart,
    onEnd,
    onError,
    onResult
  } = options;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [final, setFinal] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorEvent | null>(null);
  const [recognition] = useState<SpeechRecognition | undefined>(() => {
    if (!supported) return undefined;

    const SpeechRecognition = getSpeechRecognition();
    const speechRecognition = new SpeechRecognition();

    speechRecognition.continuous = continuous;
    if (grammars) speechRecognition.grammars = grammars;
    speechRecognition.interimResults = interimResults;
    speechRecognition.lang = language;
    speechRecognition.maxAlternatives = maxAlternatives;

    speechRecognition.onstart = () => {
      setListening(true);
      setFinal(false);
      onStart?.();
    };
    speechRecognition.onerror = (event) => {
      setError(event);
      setListening(false);
      onError?.(event);
    };
    speechRecognition.onresult = (event) => {
      const currentResult = event.results[event.resultIndex];
      const { transcript } = currentResult[0];

      setTranscript(transcript);
      setError(null);
      onResult?.(event);
    };
    speechRecognition.onend = () => {
      setListening(false);
      onEnd?.();
      speechRecognition.lang = language;
    };

    return speechRecognition;
  });

  useEffect(() => () => recognition?.stop(), []);

  const start = () => recognition?.start();
  const stop = () => recognition?.stop();
  const abort = () => recognition?.abort();

  const toggle = (value = !listening) => {
    if (value) return start();
    return stop();
  };

  return {
    supported,
    transcript,
    recognition,
    final,
    listening,
    error,
    start,
    stop,
    abort,
    toggle
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value, recognition, listening, error, start, stop, abort, toggle  } = useSpeechRecognition();
```

## Type Declarations

```tsx
interface UseSpeechRecognitionOptions {
  /** If true, recognition continues even after pauses in speech. Default is false */
  continuous?: SpeechRecognition['continuous'];
  /** A list of grammar rules */
  grammars?: SpeechRecognition['grammars'];
  /** If true, interim (non-final) results are provided as the user speaks */
  interimResults?: SpeechRecognition['interimResults'];
  /** The language in which recognition should occur. Must be a valid BCP 47 language tag (e.g., "en-US", "ru-RU") */
  language?: SpeechRecognition['lang'];
  /** The maximum number of alternative transcripts returned for a given recognition result. Must be a positive integer */
  maxAlternatives?: SpeechRecognition['maxAlternatives'];
  /** Callback invoked when speech recognition ends */
  onEnd?: () => void;
  /** Callback invoked when an error occurs during recognition */
  onError?: (error: SpeechRecognitionErrorEvent) => void;
  /** Callback invoked when recognition produces a result */
  onResult?: (event: SpeechRecognitionEvent) => void;
  /** Callback invoked when speech recognition starts */
  onStart?: () => void;
}

interface UseSpeechRecognitionReturn {
  /** The error state */
  error: SpeechRecognitionErrorEvent | null;
  /** The final transcript */
  final: boolean;
  /** Whether the hook is currently listening for speech */
  listening: boolean;
  /** The speech recognition instance */
  recognition?: SpeechRecognition;
  /** Whether the current browser supports the Web Speech API */
  supported: boolean;
  /** The current transcript */
  transcript: string;
  /** Immediately interrupts speech recognition without a final result (will not trigger `onResult`). */
  abort: () => void;
  /** Begins speech recognition */
  start: () => void;
  /** Ends speech recognition, finalizing results (will trigger `onResult`) */
  stop: () => void;
  /** Toggles the listening state */
  toggle: (value?: boolean) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.continuous | `boolean` | false | Whether recognition should continue after pauses |
| options.interimResults | `boolean` | false | Whether interim results should be provided |
| options.language | `string` | "en-US" | The language for recognition, as a valid BCP 47 tag |
| options.maxAlternatives | `number` | 1 | The maximum number of alternative transcripts to return |
| options.grammars | `SpeechGrammarList` | - | A list of grammar rules |
| options.onStart | `() => void` | - | Callback invoked when speech recognition starts |
| options.onEnd | `() => void` | - | Callback invoked when speech recognition ends |
| options.onError | `(error: SpeechRecognitionErrorEvent) => void` | - | Callback invoked when an error occurs during recognition |
| options.onResult | `(event: SpeechRecognitionEvent) => void` | - | Callback invoked when recognition produces a result |

### Returns

`UseSpeechRecognitionReturn` - An object containing the speech recognition functionality