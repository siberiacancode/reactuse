'use client'

import type { SubmitEvent } from 'react';

import { useAutoScroll, useEventListener, useField } from '@siberiacancode/reactuse';
import { ArrowDownIcon, SendIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Message {
  author: 'reactuse' | 'siberiacancode';
  avatar?: string;
  id: number;
  text: string;
  time: string;
}

const POKEMON_IDS = [1, 4, 7];

const random = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const getPokemonAvatar = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const getRandomPokemonAvatar = () => getPokemonAvatar(random(POKEMON_IDS));

const REACTUSE_REPLIES = [
  'Hey! How is the new release going?',
  'I just shipped a new hook 🚀',
  'Check out useAutoScroll — it just works.',
  'You can scroll up and pause auto-scroll, btw.',
  'No dependencies, no config needed.',
  'Coffee break? ☕',
  'Did you see the new docs?',
  'TypeScript types are fully covered.',
  'Working on a fresh demo right now.',
  'Star us on GitHub if you like it ⭐',
  'Got any feedback on the API?',
  'How do you like the new docs theme?',
  'Have you tried useDisclosure yet?',
  'I love how composable React hooks are',
  'BRB, grabbing some snacks 🍪',
  'Anyone else excited for the next release?'
];

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    author: 'reactuse',
    text: 'Hey siberiacancode 👋',
    time: formatTime(),
    avatar: getRandomPokemonAvatar()
  },
  { id: 2, author: 'siberiacancode', text: 'Hey! What’s up?', time: formatTime() },
  {
    id: 3,
    author: 'reactuse',
    text: 'Just shipped useAutoScroll today',
    time: formatTime(),
    avatar: getRandomPokemonAvatar()
  },
  {
    id: 4,
    author: 'siberiacancode',
    text: 'Nice! Does it pause on manual scroll?',
    time: formatTime()
  },
  {
    id: 5,
    author: 'reactuse',
    text: 'Yep, it just works ✨',
    time: formatTime(),
    avatar: getRandomPokemonAvatar()
  },
  { id: 6, author: 'siberiacancode', text: 'Let me try it out', time: formatTime() }
];

const SCROLL_THRESHOLD = 20;
const MAX_MESSAGES = 20;

const Demo = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const messageField = useField('');
  const [showNewMessage, setShowNewMessage] = useState(false);

  const autoScrollRef = useAutoScroll<HTMLDivElement>();
  const idRef = useRef(INITIAL_MESSAGES.length + 1);

  useEventListener(autoScrollRef, 'scroll', () => {
    const container = autoScrollRef.current;
    if (!container) return;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_THRESHOLD;
    if (isAtBottom) setShowNewMessage(false);
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = 2500 + Math.random() * 3500;
      timeoutId = setTimeout(() => {
        const container = autoScrollRef.current;
        if (!container) return;
        const isAtBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_THRESHOLD;

        setMessages((currentMessages) =>
          [
            ...currentMessages,
            {
              id: idRef.current++,
              author: 'reactuse' as const,
              text: random(REACTUSE_REPLIES),
              time: formatTime(),
              avatar: getRandomPokemonAvatar()
            }
          ].slice(-MAX_MESSAGES)
        );
        if (!isAtBottom) setShowNewMessage(true);

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  const onScrollToBottom = () => {
    const container = autoScrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    setShowNewMessage(false);
  };

  const message = messageField.watch();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages(
      [
        ...messages,
        {
          id: idRef.current++,
          author: 'siberiacancode' as const,
          text: trimmed,
          time: formatTime()
        }
      ].slice(-MAX_MESSAGES)
    );

    messageField.setValue('');
    setShowNewMessage(false);

    const container = autoScrollRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight + 50,
      behavior: 'smooth'
    });
  };

  return (
    <section className='flex w-md min-w-xs flex-col items-center'>
      <div className='flex w-full flex-col gap-3 rounded-2xl border px-4 pb-4'>
        <div className='relative'>
          <div
            ref={autoScrollRef}
            className='no-scrollbar flex h-80 flex-col gap-3 overflow-y-auto scroll-smooth'
          >
            {messages.map((message) => {
              const isMe = message.author === 'siberiacancode';
              return (
                <div
                  key={message.id}
                  className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}
                >
                  {isMe && (
                    <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-[10px] font-semibold text-white'>
                      SC
                    </div>
                  )}
                  {!isMe && (
                    <div className='size-7 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800'>
                      <img
                        alt='reactuse'
                        className='size-full translate-x-1 translate-y-1.5 scale-130 object-cover object-top'
                        src={message.avatar}
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      'relative flex max-w-[75%] items-end gap-2 rounded-xl px-3 py-2 pr-12 text-sm',
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    )}
                  >
                    <span>{message.text}</span>
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

          {showNewMessage && (
            <button
              className='absolute bottom-2 left-1/2 flex h-7 -translate-x-1/2 items-center gap-1.5 rounded-full px-3 text-xs shadow-md'
              data-variant='outline'
              type='button'
              onClick={onScrollToBottom}
            >
              <ArrowDownIcon className='size-3' />
              new message
            </button>
          )}
        </div>

        <form className='relative flex items-center gap-2' onSubmit={onSubmit}>
          <input
            className='h-11! rounded-full!'
            placeholder='Type a message...'
            {...messageField.register()}
          />
          <button
            className='absolute top-1/2 right-1 h-8! -translate-y-1/2 p-2!'
            disabled={!message}
            type='submit'
          >
            <SendIcon className='size-5' />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Demo;
