import type { UseScrollCallbackParams } from '@siberiacancode/reactuse';

import { useDebounceCallback, useScroll } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [values, setValues] = useState({ x: 0, y: 0 });

  const debouncedScrollCallback = useDebounceCallback(
    (params: UseScrollCallbackParams) =>
      setValues({ x: Math.floor(params.x), y: Math.floor(params.y) }),
    100
  );

  const scroll = useScroll<HTMLDivElement>(debouncedScrollCallback);

  return (
    <div>
      <div className='flex gap-10'>
        <div
          ref={scroll.ref}
          className='h-[300px] w-full overflow-scroll rounded-lg bg-zinc-200 dark:bg-zinc-800'
        >
          <div className='relative h-[400px] w-[500px]'>
            <div className='absolute top-0 left-0 bg-zinc-400 p-1 dark:bg-zinc-600'>TopLeft</div>
            <div className='absolute bottom-0 left-0 bg-zinc-400 p-1 dark:bg-zinc-600'>
              BottomLeft
            </div>
            <div className='absolute top-0 right-0 bg-zinc-400 p-1 dark:bg-zinc-600'>TopRight</div>
            <div className='absolute right-0 bottom-0 bg-zinc-400 p-1 dark:bg-zinc-600'>
              BottomRight
            </div>
            <div className='absolute top-1/3 left-1/3 bg-zinc-400 p-1 dark:bg-zinc-600'>
              Scroll Me
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col items-center justify-center'>
          <div>
            <b>Scroll position:</b>
            <div>
              scrolling: <code>{String(scroll.scrolling)}</code>
            </div>
            <div>
              x: <code>{values.x}</code>
            </div>
            <div>
              y: <code>{values.y}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
