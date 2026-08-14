---
title: useWebSocket
description: Hook that connects to a WebSocket server and handles incoming and outgoing messages
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783581480000
---

# useWebSocket

Hook that connects to a WebSocket server and handles incoming and outgoing messages

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { useAutoScroll, useField, useWebSocket } from '@siberiacancode/reactuse';
import { ArrowUpIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Message {
  id: number;
  role: 'assistant' | 'user';
  text: string;
}

const Demo = () => {
  const messageField = useField('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const autoScrollRef = useAutoScroll<HTMLDivElement>();

  const pushMessage = (role: Message['role'], text: string) =>
    setMessages((prev) => [...prev, { id: Math.random(), role, text }]);

  const webSocket = useWebSocket('wss://echo.websocket.org', {
    onMessage: (event) => {
      if (typeof event.data !== 'string') return;
      if (event.data.startsWith('Request served by')) return;

      setTimeout(() => {
        pushMessage('assistant', event.data);
        setLoading(false);
      }, 900);
    }
  });

  const message = messageField.watch();
  const isConnected = webSocket.status === 'connected';

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = messageField.getValue().trim();
    if (!trimmed || !isConnected || loading) return;

    pushMessage('user', trimmed);
    setLoading(true);
    webSocket.send(trimmed);
    messageField.setValue('');
  };

  return (
    <section className='mx-auto flex h-[28rem] w-full max-w-md flex-col p-4'>
      <div
        ref={autoScrollRef}
        className='no-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto scroll-smooth'
      >
        {!messages.length && !loading && (
          <div className='flex flex-1 flex-col items-center justify-center gap-5 text-center'>
            <div className='bg-muted flex size-12 items-center justify-center rounded-2xl'>
              <SparklesIcon className='text-foreground size-6' />
            </div>
            <div className='flex flex-col gap-1'>
              <h2 className='text-foreground text-lg font-semibold'>How can I help?</h2>
              <p className='text-muted-foreground text-sm'>Ask anything to get started.</p>
            </div>
          </div>
        )}

        {messages.map((item) => {
          const isUser = item.role === 'user';
          return (
            <div key={item.id} className='flex gap-3'>
              <div
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full',
                  isUser ? 'bg-muted' : 'bg-foreground'
                )}
              >
                {isUser ? (
                  <UserIcon className='text-foreground size-4' />
                ) : (
                  <SparklesIcon className='text-background size-4' />
                )}
              </div>
              <div className='flex flex-1 flex-col gap-1 pt-0.5'>
                <span className='text-foreground text-xs font-medium'>
                  {isUser ? 'You' : 'Assistant'}
                </span>
                <p className='text-foreground text-sm leading-relaxed'>{item.text}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className='flex items-center gap-1'>
            <span className='bg-muted-foreground/50 size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]' />
            <span className='bg-muted-foreground/50 size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]' />
            <span className='bg-muted-foreground/50 size-1.5 animate-bounce rounded-full' />
          </div>
        )}
      </div>

      <form className='relative mt-4' onSubmit={onSubmit}>
        <input
          className='h-12! rounded-2xl! pr-12!'
          disabled={!isConnected}
          placeholder={isConnected ? 'Message Assistant…' : 'Connecting…'}
          {...messageField.register()}
        />
        <button
          className='absolute top-1/2 right-2 size-8! -translate-y-1/2 rounded-full! p-0!'
          disabled={!message || !isConnected || loading}
          type='submit'
        >
          <ArrowUpIcon className='size-4' />
        </button>
      </form>
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
npx useverse@latest add useWebSocket
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

/** The use web socket url type */
export type UseWebSocketUrl = (() => string) | string;

/** The use web socket options type */
export interface UseWebSocketOptions {
  /** The heartbeat interval in milliseconds */
  heartbeatDelay?: number;
  /** Immediately open the connection when calling this hook */
  immediately?: boolean;
  /** The list of protocols to use */
  protocols?: Array<'soap' | 'wasm'>;
  /** The number of times to retry the connection, or a function to decide whether to retry */
  retry?: ((failureCount: number, event: CloseEvent) => boolean) | boolean | number;
  /** The delay in milliseconds before retrying the connection */
  retryDelay?: number;
  /** The heartbeat callback that is called on each tick */
  heartbeat?: (webSocket: WebSocket) => void;
  /** The callback function that is called when the WebSocket connection is closed */
  onClose?: (event: CloseEvent, webSocket: WebSocket) => void;
  /** The callback function that is called when the WebSocket connection is established */
  onConnected?: (webSocket: WebSocket) => void;
  /** The callback function that is called when an error occurs */
  onError?: (event: Event, webSocket: WebSocket) => void;
  /** The callback function that is called when a message is received */
  onMessage?: (event: MessageEvent, webSocket: WebSocket) => void;
}

/** The use web socket status type */
export type UseWebSocketStatus = 'closed' | 'connected' | 'connecting' | 'failed';

/** The use web socket return type */
export interface UseWebSocketReturn {
  /** The WebSocket client */
  client?: WebSocket;
  /** The close function */
  close: WebSocket['close'];
  /** The send function */
  send: WebSocket['send'];
  /** The status of the WebSocket connection */
  status: UseWebSocketStatus;
  /** The open function */
  open: () => void;
}

/**
 * @name useWebSocket
 * @description - Hook that connects to a WebSocket server and handles incoming and outgoing messages
 * @category Browser
 * @usage medium
 *
 * @browserapi WebSocket https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 *
 * @param {UseWebSocketUrl} url The URL of the WebSocket server
 * @param {(webSocket: WebSocket) => void} [options.onConnected] The callback function that is called when the WebSocket connection is established
 * @param {(event: CloseEvent, webSocket: WebSocket) => void} [options.onClose] The callback function that is called when the WebSocket connection is closed
 * @param {(event: Event, webSocket: WebSocket) => void} [options.onError] The callback function that is called when an error occurs
 * @param {(event: MessageEvent, webSocket: WebSocket) => void} [options.onMessage] The callback function that is called when a message is received
 * @param {boolean} [options.immediately=true] Immediately open the connection when calling this hook
 * @param {boolean | number | ((failureCount: number, event: CloseEvent) => boolean)} [options.retry] The number of times to retry the connection, or a function to decide whether to retry
 * @param {number} [options.retryDelay=0] The delay in milliseconds before retrying the connection
 * @param {((webSocket: WebSocket) => void)} [options.heartbeat] The heartbeat callback that is called on each tick
 * @param {number} [options.heartbeatDelay=30000] The heartbeat interval in milliseconds
 * @param {Array<'soap' | 'wasm'>} [options.protocols] The list of protocols to use
 * @returns {UseWebSocketReturn} An object with the status, close, send, open, and client properties
 *
 * @example
 * const { status, close, send, open, client } = useWebSocket('url');
 */
export const useWebSocket = (
  url: UseWebSocketUrl,
  options?: UseWebSocketOptions
): UseWebSocketReturn => {
  const immediately = options?.immediately ?? true;
  const webSocketRef = useRef<WebSocket>(undefined);
  const failureCountRef = useRef(0);
  const explicityCloseRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const [status, setStatus] = useState<UseWebSocketStatus>(immediately ? 'connecting' : 'closed');

  const send = (data: string | Blob | BufferSource) => {
    webSocketRef.current?.send(data);
  };

  const close = () => {
    explicityCloseRef.current = true;
    clearTimeout(retryTimeoutRef.current);
    clearInterval(heartbeatIntervalRef.current);
    webSocketRef.current?.close();
    webSocketRef.current = undefined;
  };

  const init = () => {
    webSocketRef.current = new WebSocket(
      typeof url === 'function' ? url() : url,
      options?.protocols
    );
    setStatus('connecting');

    const webSocket = webSocketRef.current;
    if (!webSocket) return;

    webSocket.onopen = () => {
      failureCountRef.current = 0;
      setStatus('connected');
      options?.onConnected?.(webSocket);

      if (!options?.heartbeat) return;
      const { heartbeat } = options;

      heartbeatIntervalRef.current = setInterval(() => {
        if (webSocket.readyState !== WebSocket.OPEN)
          return clearInterval(heartbeatIntervalRef.current);
        heartbeat(webSocket);
      }, options.heartbeatDelay ?? 30000);
    };

    webSocket.onerror = (event) => {
      setStatus('failed');
      options?.onError?.(event, webSocket);
    };

    webSocket.onmessage = (event) => options?.onMessage?.(event, webSocket);

    webSocket.onclose = (event) => {
      clearInterval(heartbeatIntervalRef.current);
      setStatus('closed');
      options?.onClose?.(event, webSocket);
      if (explicityCloseRef.current) return;

      const shouldRetry =
        typeof options?.retry === 'function'
          ? options.retry(failureCountRef.current, event)
          : failureCountRef.current < getRetry(options?.retry ?? 0);

      if (shouldRetry) {
        failureCountRef.current += 1;
        const delay = options?.retryDelay ?? 0;
        if (!delay) return init();
        retryTimeoutRef.current = setTimeout(init, delay);
        return;
      }
      failureCountRef.current = 0;
    };
  };

  const open = () => {
    explicityCloseRef.current = false;
    clearTimeout(retryTimeoutRef.current);
    clearInterval(heartbeatIntervalRef.current);
    if (webSocketRef.current) {
      webSocketRef.current.onclose = null;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    }
    init();
  };

  useEffect(() => {
    if (immediately) init();

    return () => {
      clearTimeout(retryTimeoutRef.current);
      clearInterval(heartbeatIntervalRef.current);
      if (!webSocketRef.current) return;
      webSocketRef.current.onclose = null;
      webSocketRef.current.close();
      webSocketRef.current = undefined;
    };
  }, [url]);

  return { client: webSocketRef.current, close, open, send, status };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { status, close, send, open, client } = useWebSocket('url');
```

## Type Declarations

```tsx
export type UseWebSocketUrl = (() => string) | string;

export interface UseWebSocketOptions {
  /** The heartbeat interval in milliseconds */
  heartbeatDelay?: number;
  /** Immediately open the connection when calling this hook */
  immediately?: boolean;
  /** The list of protocols to use */
  protocols?: Array<'soap' | 'wasm'>;
  /** The number of times to retry the connection, or a function to decide whether to retry */
  retry?: ((failureCount: number, event: CloseEvent) => boolean) | boolean | number;
  /** The delay in milliseconds before retrying the connection */
  retryDelay?: number;
  /** The heartbeat callback that is called on each tick */
  heartbeat?: (webSocket: WebSocket) => void;
  /** The callback function that is called when the WebSocket connection is closed */
  onClose?: (event: CloseEvent, webSocket: WebSocket) => void;
  /** The callback function that is called when the WebSocket connection is established */
  onConnected?: (webSocket: WebSocket) => void;
  /** The callback function that is called when an error occurs */
  onError?: (event: Event, webSocket: WebSocket) => void;
  /** The callback function that is called when a message is received */
  onMessage?: (event: MessageEvent, webSocket: WebSocket) => void;
}

export type UseWebSocketStatus = 'closed' | 'connected' | 'connecting' | 'failed';

export interface UseWebSocketReturn {
  /** The WebSocket client */
  client?: WebSocket;
  /** The close function */
  close: WebSocket['close'];
  /** The send function */
  send: WebSocket['send'];
  /** The status of the WebSocket connection */
  status: UseWebSocketStatus;
  /** The open function */
  open: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| url | `UseWebSocketUrl` | - | The URL of the WebSocket server |
| options.onConnected | `(webSocket: WebSocket) => void` | - | The callback function that is called when the WebSocket connection is established |
| options.onClose | `(event: CloseEvent, webSocket: WebSocket) => void` | - | The callback function that is called when the WebSocket connection is closed |
| options.onError | `(event: Event, webSocket: WebSocket) => void` | - | The callback function that is called when an error occurs |
| options.onMessage | `(event: MessageEvent, webSocket: WebSocket) => void` | - | The callback function that is called when a message is received |
| options.immediately | `boolean` | true | Immediately open the connection when calling this hook |
| options.retry | `boolean \| number \| ((failureCount: number, event: CloseEvent) => boolean)` | - | The number of times to retry the connection, or a function to decide whether to retry |
| options.retryDelay | `number` | 0 | The delay in milliseconds before retrying the connection |
| options.heartbeat | `((webSocket: WebSocket) => void)` | - | The heartbeat callback that is called on each tick |
| options.heartbeatDelay | `number` | 30000 | The heartbeat interval in milliseconds |
| options.protocols | `Array<'soap' \| 'wasm'>` | - | The list of protocols to use |

### Returns

`UseWebSocketReturn` - An object with the status, close, send, open, and client properties