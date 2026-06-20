import { useScroll } from '@siberiacancode/reactuse';
import { ClockIcon, UserIcon } from 'lucide-react';
import { useRef } from 'react';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'Take useScroll. It gives you a reactive snapshot of the scroll position, the direction of travel, and the arrived edges — top, bottom, left and right — without any manual math.',
  'Wire the callback straight to the DOM and you never pay for a rerender. Update styles imperatively as the user scrolls, exactly like you would with a mouse-driven spotlight.',
  'The arrived state flips the moment a user reaches an edge. No off-by-one threshold bugs, no scrollHeight juggling scattered across effects — the hook already did the work.',
  'Directions reveal intent. Is the user scrolling up or down right now? That single bit of information powers hiding headers, lazy loading and scroll-triggered animations.',
  'Because the value is a snapshot, you opt into rerenders only when you actually want them. Read it imperatively, or watch it — the choice stays with you.',
  'You have reached the end of the article. The progress bar above just hit one hundred percent — try scrolling back up to watch it rewind.'
];

const Demo = () => {
  const barRef = useRef<HTMLDivElement>(null);

  const scroll = useScroll<HTMLDivElement>((params) => {
    const el = scroll.ref.current;
    if (!el || !barRef.current) return;

    const max = el.scrollHeight - el.clientHeight;
    const progress = max > 0 ? Math.min(100, (params.y / max) * 100) : 0;
    barRef.current.style.width = `${progress}%`;
  });

  return (
    <section className='flex min-w-xs flex-col gap-3 md:min-w-md'>
      <div className='bg-muted h-1 w-full overflow-hidden rounded-full'>
        <div
          ref={barRef}
          className='bg-primary h-full rounded-full transition-[width] duration-100 ease-out'
          style={{ width: 0 }}
        />
      </div>

      <div ref={scroll.ref} className='no-scrollbar flex h-96 flex-col gap-5 overflow-y-auto'>
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
      </div>
    </section>
  );
};

export default Demo;
