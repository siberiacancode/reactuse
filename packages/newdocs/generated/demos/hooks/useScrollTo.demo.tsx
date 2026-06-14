'use client'

import { useScrollTo } from '@siberiacancode/reactuse';
import { ArrowUpIcon, ClockIcon, UserIcon } from 'lucide-react';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'Take useScrollTo. It scrolls a container to an exact position. Give it x and y coordinates and it glides there — no scrollTop assignments, no behavior boilerplate scattered around your handlers.',
  'Unlike scrolling to an element, you control the precise point. Jump to the very top, restore a saved offset, or move to any coordinate you computed, all through a single trigger call.',
  'It also accepts immediately, scrolling to the position right after mount. That makes restoring a previous scroll offset trivial when a view first opens.',
  'Because the container is held inside the hook, you never reach for refs and manual math in every handler. One ref, one trigger, and the scrolling concern stays in a single place.',
  'That keeps components readable. The intent — scroll to this position — reads straight off the call site, instead of hiding behind imperative DOM access buried in an effect.',
  'You have reached the end of the article. Use the button below to glide all the way back to the top in a single smooth motion.'
];

const Demo = () => {
  const scrollTo = useScrollTo<HTMLDivElement>();

  return (
    <section className='flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div className='relative overflow-hidden rounded-xl'>
        <div
          ref={scrollTo.ref}
          className='no-scrollbar flex h-96 flex-col gap-5 overflow-y-auto p-5'
        >
          <header className='flex flex-col gap-2'>
            <h1 className='text-foreground text-2xl leading-tight font-semibold'>
              Meet reactuse — a hooks library you will love
            </h1>
            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <UserIcon className='size-3.5' />
                reactuse
              </span>
              <span className='flex items-center gap-1.5'>
                <ClockIcon className='size-3.5' />3 min read
              </span>
            </div>
          </header>

          <article className='flex flex-col gap-4'>
            {PARAGRAPHS.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>

          <div className='flex justify-center pt-2'>
            <button
              data-variant='outline'
              type='button'
              onClick={() => scrollTo.trigger({ x: 0, y: 0, behavior: 'smooth' })}
            >
              <ArrowUpIcon />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
