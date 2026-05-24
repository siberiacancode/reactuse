'use client'

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
