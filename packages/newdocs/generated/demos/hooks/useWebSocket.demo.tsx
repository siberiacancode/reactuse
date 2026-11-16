'use client'

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
