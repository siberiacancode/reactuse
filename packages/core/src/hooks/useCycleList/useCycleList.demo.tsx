import { useCycleList } from '@siberiacancode/reactuse';
import { Music4, Repeat2, SkipBack, SkipForward } from 'lucide-react';

const Demo = () => {
  const bands = ['AC/DC', 'Metallica', 'Skillet', 'Linkin Park', 'Nirvana', 'Muse'];

  const { value: band, index, next, prev, go } = useCycleList(bands, { defaultIndex: 2 });

  return (
    <div className='flex w-full items-center justify-center bg-transparent p-6'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full max-w-sm rounded-3xl border shadow-sm backdrop-blur'>
        <div className='p-6'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>Now playing</p>
              <h2 className='text-lg font-semibold tracking-tight'>useCycleList Player</h2>
            </div>
            <div className='bg-muted/40 flex h-10 w-10 items-center justify-center rounded-2xl border'>
              <Music4 className='h-5 w-5' />
            </div>
          </div>

          <div className='bg-muted/30 mb-6 rounded-2xl border p-5'>
            <div className='from-muted to-background mb-4 flex aspect-square w-full items-center justify-center rounded-2xl border bg-gradient-to-br'>
              <div className='bg-background flex h-20 w-20 items-center justify-center rounded-full border shadow-sm'>
                <Music4 className='h-8 w-8' />
              </div>
            </div>

            <div className='space-y-1 text-center'>
              <div className='truncate text-lg font-semibold'>{band}</div>
            </div>
          </div>

          <div className='mb-2 space-y-2'>
            <div className='bg-muted h-2 overflow-hidden rounded-full'>
              <div
                className='bg-foreground h-full rounded-full transition-all'
                style={{ width: `${((index + 1) / bands.length) * 100}%` }}
              />
            </div>
          </div>

          <div className='mt-6 flex items-center justify-center gap-3'>
            <button
              aria-label='Previous track'
              className='bg-background hover:bg-muted inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-sm transition'
              type='button'
              onClick={() => prev()}
            >
              <SkipBack className='h-5 w-5' />
            </button>

            <button
              aria-label='Next track'
              className='bg-background hover:bg-muted inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-sm transition'
              type='button'
              onClick={() => next()}
            >
              <SkipForward className='h-5 w-5' />
            </button>
          </div>

          <div className='bg-muted/20 mt-5 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <Repeat2 className='h-4 w-4' />
              <span>Loop enabled</span>
            </div>
            <span className='font-medium'>#{index + 1}</span>
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            {bands.map((item, i) => (
              <button
                key={item}
                className='cursor-pointer rounded-full border px-3 py-1.5 text-xs transition'
                type='button'
                onClick={() => go(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
