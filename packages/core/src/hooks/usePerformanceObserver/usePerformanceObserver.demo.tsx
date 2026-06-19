import { usePerformanceObserver } from '@siberiacancode/reactuse';
import { GaugeIcon, RotateCwIcon } from 'lucide-react';

const formatMs = (value: number) => `${Math.round(value)}ms`;
const formatLabel = (name: string) =>
  name
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const Demo = () => {
  const performance = usePerformanceObserver({
    entryTypes: ['paint'],
    buffered: true,
    immediate: true
  });

  if (!performance.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-6'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-2'>
          <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
            <GaugeIcon className='size-5' />
          </div>
          <div className='flex flex-col'>
            <h3 className='text-base!'>Page paint timings</h3>
            <p className='text-muted-foreground text-xs'>How fast this page rendered for you</p>
          </div>
        </div>

        <button
          aria-label='Refresh'
          className='self-start rounded-full!'
          data-size='icon'
          data-variant='outline'
          type='button'
          onClick={() => window.location.reload()}
        >
          <RotateCwIcon className='size-4' />
        </button>
      </div>

      {!performance.entries.length && (
        <p className='text-muted-foreground text-sm'>Waiting for paint entries...</p>
      )}

      {!!performance.entries.length && (
        <div className='divide-border flex flex-col divide-y'>
          {performance.entries.map((entry) => (
            <div key={entry.name} className='flex items-center justify-between py-2.5'>
              <span className='text-sm font-medium'>{formatLabel(entry.name)}</span>
              <span className='text-muted-foreground text-sm tabular-nums'>
                {formatMs(entry.startTime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Demo;
