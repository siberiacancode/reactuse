import { useMediaQuery, useOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const orientation = useOrientation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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

  if (isDesktop) {
    return (
      <section className='flex justify-center p-6'>
        <div className='flex flex-col items-center'>
          <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
            <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

            <div className='flex items-center justify-between'>
              <h3 className='text-4xl!'>Desktop orientation</h3>
            </div>

            <p className='text-muted-foreground text-sm'>
              Screen orientation does not change on <b>desktop</b> displays — they don't rotate.
              Open this page on a mobile device or use your browser's device inspector to see the
              orientation change in action.
            </p>
          </div>

          <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
          <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
        </div>
      </section>
    );
  }

  const portrait = orientation.value.orientationType?.startsWith('portrait') ?? true;

  return (
    <section className='flex flex-col items-center gap-5 p-6'>
      <p className='text-muted-foreground max-w-xs text-center text-sm'>
        Rotate your device or use your browser's inspector to simulate an orientation change.
      </p>

      <div className='mt-4 flex items-center justify-center'>
        <div
          style={{
            width: portrait ? 200 : 340,
            height: portrait ? 340 : 200
          }}
          className='border-foreground/20 relative flex shrink-0 flex-col items-center justify-center gap-1 rounded-[2rem] border-[3px] transition-all duration-500 ease-in-out'
        >
          <div
            className={
              portrait
                ? 'bg-foreground/15 absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full'
                : 'bg-foreground/15 absolute top-1/2 left-3 h-10 w-1 -translate-y-1/2 rounded-full'
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
