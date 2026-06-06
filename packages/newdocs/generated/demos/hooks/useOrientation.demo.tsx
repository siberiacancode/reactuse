'use client'

import { useOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const orientation = useOrientation();

  if (!orientation.supported || !orientation.value)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  const portrait = orientation.value.orientationType?.startsWith('portrait') ?? true;

  return (
    <section className='items-cesnter flex flex-col gap-5 p-6'>
      <p className='text-muted-foreground max-w-xs text-center text-sm'>
        Rotate your device or use your browser's inspector to simulate an orientation change.
      </p>

      <div className='mt-4 flex items-center justify-center'>
        <div
          style={{
            width: portrait ? 220 : 360,
            height: portrait ? 360 : 220
          }}
          className='border-foreground/20 relative flex shrink-0 flex-col items-center justify-center gap-1 rounded-[2rem] border-[5px] transition-all duration-500 ease-in-out'
        >
          <div
            className={
              portrait
                ? 'bg-foreground/20 absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full'
                : 'bg-foreground/20 absolute top-1/2 left-3 h-12 w-1 -translate-y-1/2 rounded-full'
            }
          />

          <span className='text-foreground text-xl font-semibold'>
            {portrait ? 'Portrait' : 'Landscape'}
          </span>
          <span className='text-muted-foreground text-sm tabular-nums'>
            {orientation.value.angle}°
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
