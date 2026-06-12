'use client';

import { useRafState } from '@siberiacancode/reactuse';

const getStatus = (progress: number) => {
  if (progress >= 100)
    return {
      title: "You've reached the end",
      description: 'The value updated smoothly on every animation frame as you scrolled.'
    };
  if (progress >= 50)
    return {
      title: 'Halfway there',
      description: 'Each scroll event is throttled to a single update per frame for performance.'
    };
  return {
    title: 'Start scrolling',
    description: 'Scroll inside this area to update the progress in sync with the browser repaint.'
  };
};

const Demo = () => {
  const [progress, setProgress] = useRafState(0);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const max = scrollHeight - clientHeight;
    setProgress(max > 0 ? Math.round((scrollTop / max) * 100) : 0);
  };

  const status = getStatus(progress);

  return (
    <section className='flex w-full max-w-sm justify-center p-6'>
      <div className='no-scrollbar relative h-72 w-full overflow-y-auto' onScroll={onScroll}>
        <div className='pointer-events-none sticky top-0 flex h-72 flex-col items-center justify-center gap-3 px-4 text-center'>
          <h3 className='text-2xl!'>{status.title}</h3>

          <div className='bg-muted h-1 w-40 overflow-hidden rounded-full'>
            <div className='bg-primary h-full rounded-full' style={{ width: `${progress}%` }} />
          </div>

          <p className='text-muted-foreground max-w-[18rem] text-sm leading-relaxed'>
            {status.description}
          </p>

          <span className='text-muted-foreground font-mono text-xs tabular-nums'>{progress}%</span>
        </div>

        <div className='h-[800px]' />
      </div>
    </section>
  );
};

export default Demo;
