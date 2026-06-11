'use client'

import { useRenderInfo, useRerender } from '@siberiacancode/reactuse';
import { ActivityIcon, RefreshCwIcon } from 'lucide-react';

const formatTime = (timestamp: number | null) => {
  if (!timestamp) return 'never';

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const Demo = () => {
  const rerender = useRerender();
  const renderInfo = useRenderInfo('PreviewCard', false);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='border-border bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <ActivityIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>{renderInfo.component}</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The hook tracks how many times this component rendered and when the last render
              happened.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Last gap
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {renderInfo.sinceLast}ms
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Time</span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {formatTime(renderInfo.timestamp)}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Renders
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {renderInfo.renders}
            </span>
          </div>

          <button data-size='sm' data-variant='outline' type='button' onClick={rerender}>
            <RefreshCwIcon className='size-3.5' />
            Re-render
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
