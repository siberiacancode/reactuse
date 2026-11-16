---
title: usePostMessage
description: Hook that allows you to receive messages from other origins
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1769360827000
---

# usePostMessage

Hook that allows you to receive messages from other origins

## Demo

```tsx
import { usePostMessage } from '@siberiacancode/reactuse';
import { KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const generateCode = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => CHARS[byte % CHARS.length]).join(
    ''
  );

const Demo = () => {
  const [code, setCode] = useState<string>();

  const postMessage = usePostMessage<{ type: 'code'; value: string }>('*', (message) => {
    if (message.type === 'code') setCode(message.value);
  });

  const onRequest = () => postMessage({ type: 'code', value: generateCode() });

  return (
    <section className='flex w-full justify-center p-6'>
      <div className='border-border bg-card flex w-full max-w-xs flex-col items-center gap-5 rounded-xl border p-6 text-center'>
        <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
          <KeyRoundIcon className='size-6' />
        </div>

        <div className='flex flex-col gap-1'>
          <h3 className='text-lg!'>One-time code</h3>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Request a single-use verification code from the service. A fresh one is delivered each
            time.
          </p>
        </div>

        {!code && (
          <button className='w-full' type='button' onClick={onRequest}>
            Get code
          </button>
        )}

        {code && (
          <div className='flex flex-col items-center gap-3'>
            <span className='text-foreground font-mono text-4xl font-bold tracking-[0.25em]'>
              {code}
            </span>
            <button
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
              data-variant='unstyled'
              type='button'
              onClick={onRequest}
            >
              Get a new code
            </button>
          </div>
        )}
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
npx useverse@latest add usePostMessage
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

/** The origin of the message */
export type UsePostMessageOrigin = string | '*' | string[];

/** The return type of the usePostMessage hook */
export type UsePostMessageReturn<Message> = (message: Message) => void;

/**
 * @name usePostMessage
 * @description - Hook that allows you to receive messages from other origins
 * @category Browser
 * @usage low
 *
 * @overload
 * @template Message The message data type
 * @param {UsePostMessageOrigin} origin The origin of the message
 * @param {(message: Message) => Message} callback callback to get received message
 * @returns {(message: Message) => void} An object containing the current message
 *
 * @example
 * const postMessage = usePostMessage();
 */
export const usePostMessage = <Message>(
  origin: UsePostMessageOrigin,
  callback: (message: Message, event: MessageEvent<Message>) => void
): UsePostMessageReturn<Message> => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOriginRef = useRef(origin);
  internalOriginRef.current = origin;

  useEffect(() => {
    const onMessage = (event: MessageEvent<Message>) => {
      if (Array.isArray(internalOriginRef.current)) {
        if (!internalOriginRef.current.includes(event.origin)) return;
      } else if (internalOriginRef.current !== '*' && event.origin !== internalOriginRef.current)
        return;

      internalCallbackRef.current(event.data as Message, event);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const postMessage = (message: Message) => {
    if (Array.isArray(internalOriginRef.current))
      return internalOriginRef.current.forEach((origin) => window.postMessage(message, origin));

    window.postMessage(message, internalOriginRef.current);
  };

  return postMessage;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const postMessage = usePostMessage();
```

## Type Declarations

```tsx
export type UsePostMessageOrigin = string | '*' | string[];

export type UsePostMessageReturn<Message> = (message: Message) => void;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| origin | `UsePostMessageOrigin` | - | The origin of the message |
| callback | `(message: Message) => Message` | - | callback to get received message |

### Returns

`(message: Message) => void` - An object containing the current message