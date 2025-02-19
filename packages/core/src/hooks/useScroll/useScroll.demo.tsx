import { useState } from 'react';

import type { UseScrollCallbackParams } from './useScroll';

import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';
import { useScroll } from './useScroll';

const Demo = () => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const debouncedScrollCallback = useDebounceCallback(
    (params: UseScrollCallbackParams) =>
      setScroll({ x: Math.floor(params.x), y: Math.floor(params.y) }),
    100
  );

  const [scrollRef, scrolling] = useScroll<HTMLDivElement>(debouncedScrollCallback);

  return (
    <div>
      <div className='flex gap-10'>
        <div ref={scrollRef} className='h-[300px] w-full overflow-scroll rounded-lg bg-zinc-800'>
          <div className='relative h-[400px] w-[500px]'>
            <div className='absolute top-0 left-0 bg-zinc-600 p-1'>TopLeft</div>
            <div className='absolute bottom-0 left-0 bg-zinc-600 p-1'>BottomLeft</div>
            <div className='absolute top-0 right-0 bg-zinc-600 p-1'>TopRight</div>
            <div className='absolute right-0 bottom-0 bg-zinc-600 p-1'>BottomRight</div>
            <div className='absolute top-1/3 left-1/3 bg-zinc-600 p-1'>Scroll Me</div>
          </div>
        </div>

        <div className='flex w-full flex-col items-center justify-center'>
          <div>
            <b>Scroll position:</b>
            <div>
              scrolling: <code>{String(scrolling)}</code>
            </div>
            <div>
              x: <code>{scroll.x}</code>
            </div>
            <div>
              y: <code>{scroll.y}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
