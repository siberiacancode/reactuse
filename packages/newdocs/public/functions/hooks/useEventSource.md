---
title: useEventSource
description: Hook that provides a reactive wrapper for event source
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1767095034000
---

# useEventSource

Hook that provides a reactive wrapper for event source

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { useAutoScroll, useEventSource, useField } from '@siberiacancode/reactuse';
import { SendIcon, SquareIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Message {
  author: 'reactuse' | 'siberiacancode';
  id: number;
  streaming?: boolean;
  text: string;
  time: string;
}

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    author: 'reactuse',
    text: 'Hey siberiacancode 👋 ask me anything — I will stream the answer back via SSE',
    time: formatTime()
  }
];

const Demo = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const messageField = useField('');
  const autoScrollRef = useAutoScroll<HTMLDivElement>();
  const idRef = useRef(INITIAL_MESSAGES.length + 1);

  const eventSource = useEventSource('https://sse.dev/test', ['message'], {
    immediately: false,
    onMessage: (event) => {
      setMessages((current) => {
        const last = current.at(-1)!;
        return [...current.slice(0, -1), { ...last, text: `${last.text} ${event.data}`.trim() }];
      });
    }
  });

  const isStreaming = messages.at(-1)?.streaming === true;
  const message = messageField.watch();

  const onSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { id: idRef.current++, author: 'siberiacancode', text: trimmed, time: formatTime() },
      {
        id: idRef.current++,
        author: 'reactuse',
        text: '',
        time: formatTime(),
        streaming: true
      }
    ]);

    messageField.setValue('');
    eventSource.open();
  };

  const onStop = () => {
    eventSource.close();
    setMessages((current) => current.slice(0, -1));
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend();
  };

  return (
    <section className='flex w-md min-w-xs flex-col items-center'>
      <div className='flex w-full flex-col gap-3 rounded-2xl border px-4 pb-4'>
        <div
          ref={autoScrollRef}
          className='no-scrollbar flex h-80 flex-col gap-3 overflow-y-auto scroll-smooth pt-4'
        >
          {messages.map((message) => {
            const isMe = message.author === 'siberiacancode';
            return (
              <div key={message.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'relative flex max-w-[75%] items-end gap-2 rounded-xl px-3 py-2 pr-12 text-sm',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  )}
                >
                  <span>
                    {message.text || (
                      <span className='inline-flex items-center gap-1'>
                        <span className='bg-muted-foreground/60 size-1.5 animate-pulse rounded-full' />
                        <span
                          className='bg-muted-foreground/60 size-1.5 animate-pulse rounded-full'
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className='bg-muted-foreground/60 size-1.5 animate-pulse rounded-full'
                          style={{ animationDelay: '300ms' }}
                        />
                      </span>
                    )}
                    {message.streaming && message.text && (
                      <span className='ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-current align-middle' />
                    )}
                  </span>
                  <span
                    className={cn(
                      'absolute right-3 bottom-1 text-[9px] opacity-60',
                      isMe ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <form className='relative flex items-center gap-2' onSubmit={onSubmit}>
          <input
            className='h-11! rounded-full!'
            disabled={isStreaming}
            placeholder={isStreaming ? 'Streaming response...' : 'Type a message...'}
            {...messageField.register()}
          />

          {isStreaming && (
            <button
              aria-label='Stop generating'
              className='absolute top-1/2 right-1 h-8! -translate-y-1/2 rounded-full! p-2!'
              type='button'
              onClick={onStop}
            >
              <SquareIcon className='size-5' />
            </button>
          )}

          {!isStreaming && (
            <button
              aria-label='Send'
              className='absolute top-1/2 right-1 h-8! -translate-y-1/2 rounded-full! p-2!'
              disabled={!message}
              type='submit'
            >
              <SendIcon className='size-5' />
            </button>
          )}
        </form>
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
npx useverse@latest add useEventSource
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

/** The use event source options type */
export interface UseEventSourceOptions<QueryData, Data> extends EventSourceInit {
  /** Immediately open the connection when calling this hook */
  immediately?: boolean;
  /* The placeholder data for the hook */
  placeholderData?: (() => Data) | Data;
  /* The retry count of requests */
  retry?: boolean | number;
  /* The retry delay of requests */
  retryDelay?: ((retry: number, event: Event) => number) | number;
  /* The onError function to be invoked */
  onError?: (error: Event) => void;
  /* The onMessage function to be invoked */
  onMessage?: (event: Event & { data?: Data }) => void;
  /* The onOpen function to be invoked */
  onOpen?: () => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
}

/** The use event source return type */
interface UseEventSourceReturn<Data = any> {
  /** The latest data received via the EventSource */
  data?: Data;
  /** The current error */
  error?: Event;
  /** The instance of the EventSource */
  instance?: EventSource;
  /* The connecting state of the query */
  isConnecting: boolean;
  /* The error state of the query */
  isError: boolean;
  /* The open state of the query */
  opened: boolean;
  /** Closes the EventSource connection gracefully */
  close: () => void;
  /** Reopen the EventSource connection */
  open: () => void;
}

/**
 * @name useEventSource
 * @description - Hook that provides a reactive wrapper for event source
 * @category Browser
 * @usage low
 *
 * @browserapi EventSource https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 *
 * @param {string | URL} url The URL of the EventSource
 * @param {string[]} [events=[]] List of events to listen to
 * @param {UseEventSourceOptions} [options={}] Configuration options
 * @returns {UseEventSourceReturn<Data>} The EventSource state and controls
 *
 * @example
 * const { instance, data, connecting, opened, isError, close, open } = useEventSource('url', ['message']);
 */
export const useEventSource = <QueryData = any, Data = QueryData>(
  url: string | URL,
  events: string[] = [],
  options: UseEventSourceOptions<QueryData, Data> = {}
): UseEventSourceReturn<Data> => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isError, setIsError] = useState(false);

  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const [error, setError] = useState<Event | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(options?.placeholderData);

  const eventSourceRef = useRef<EventSource>(undefined);

  const immediately = options.immediately ?? true;

  const onEventRef = useRef((event: Event & { data?: Data }) => setData(event.data));

  const close = () => {
    if (!eventSourceRef.current) return;

    setOpened(false);
    setIsConnecting(false);
    setIsError(false);

    events.forEach((eventName) =>
      eventSourceRef.current!.removeEventListener(eventName, onEventRef.current)
    );

    eventSourceRef.current.close();
    eventSourceRef.current = undefined;
  };

  const open = () => {
    close();

    const eventSource = new EventSource(url, {
      withCredentials: options.withCredentials ?? false
    });
    eventSourceRef.current = eventSource;

    setIsConnecting(true);

    eventSource.onopen = () => {
      setOpened(true);
      setIsConnecting(false);
      setError(undefined);
      options?.onOpen?.();
    };

    eventSource.onerror = (event) => {
      setOpened(false);
      setIsConnecting(false);
      setIsError(true);
      setError(event);
      options?.onError?.(event);

      if (retryCountRef.current > 0) {
        retryCountRef.current -= 1;

        const retryDelay =
          typeof options?.retryDelay === 'function'
            ? options?.retryDelay(retryCountRef.current, event)
            : options?.retryDelay;

        if (retryDelay) {
          setTimeout(open, retryDelay);
          return;
        }

        return open();
      }

      retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
    };

    eventSource.onmessage = (event) => {
      const data = options?.select ? options?.select(event.data) : event.data;
      setData(data);
      options?.onMessage?.(event);
    };

    events.forEach((eventName) => eventSource.addEventListener(eventName, onEventRef.current));
  };

  useEffect(() => {
    if (!immediately) return;

    open();
    return () => {
      close();
    };
  }, [immediately]);

  return {
    instance: eventSourceRef.current,
    data,
    error,
    isConnecting,
    opened,
    isError,
    close,
    open
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { instance, data, connecting, opened, isError, close, open } = useEventSource('url', ['message']);
```

## Type Declarations

```tsx
export interface UseEventSourceOptions<QueryData, Data> extends EventSourceInit {
  /** Immediately open the connection when calling this hook */
  immediately?: boolean;
  /* The placeholder data for the hook */
  placeholderData?: (() => Data) | Data;
  /* The retry count of requests */
  retry?: boolean | number;
  /* The retry delay of requests */
  retryDelay?: ((retry: number, event: Event) => number) | number;
  /* The onError function to be invoked */
  onError?: (error: Event) => void;
  /* The onMessage function to be invoked */
  onMessage?: (event: Event & { data?: Data }) => void;
  /* The onOpen function to be invoked */
  onOpen?: () => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
}

interface UseEventSourceReturn<Data = any> {
  /** The latest data received via the EventSource */
  data?: Data;
  /** The current error */
  error?: Event;
  /** The instance of the EventSource */
  instance?: EventSource;
  /* The connecting state of the query */
  isConnecting: boolean;
  /* The error state of the query */
  isError: boolean;
  /* The open state of the query */
  opened: boolean;
  /** Closes the EventSource connection gracefully */
  close: () => void;
  /** Reopen the EventSource connection */
  open: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| url | `string \| URL` | - | The URL of the EventSource |
| events | `string[]` | [] | List of events to listen to |
| options | `UseEventSourceOptions` | {} | Configuration options |

### Returns

`UseEventSourceReturn<Data>` - The EventSource state and controls