'use client'

import { useHotkeys, usePaint } from '@siberiacancode/reactuse';
import { Redo2Icon, Undo2Icon } from 'lucide-react';

import { cn } from '@/utils/lib';

const SIZES = [
  { label: 'S', value: 4 },
  { label: 'M', value: 10 },
  { label: 'L', value: 18 }
];

const Demo = () => {
  const paint = usePaint({ color: '#ffffff', radius: 10 }, { smooth: true });

  const onUndo = () => paint.undo();

  const onRedo = () => paint.redo();

  const onClear = () => paint.clear();

  useHotkeys('control+keyz', (event) => {
    event.preventDefault();
    if (event.shiftKey) return onRedo();
    onUndo();
  });

  useHotkeys('meta+keyz', (event) => {
    event.preventDefault();
    if (event.shiftKey) return onRedo();
    onUndo();
  });

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <label
            className='border-border relative flex size-5 cursor-pointer items-center justify-center overflow-hidden rounded-full! border'
            style={{ backgroundColor: paint.color }}
          >
            <input
              className='absolute inset-0 cursor-pointer p-0! opacity-0'
              type='color'
              value={paint.color}
              onChange={(event) => paint.changeColor(event.target.value)}
            />
          </label>

          <div className='bg-muted flex items-center gap-0.5 rounded-lg p-0.5'>
            {SIZES.map((size) => (
              <button
                key={size.value}
                className={cn(
                  'flex h-7! items-center justify-center rounded-md! p-2!',
                  paint.radius === size.value ? 'bg-background' : 'text-muted-foreground'
                )}
                data-variant='ghost'
                type='button'
                onClick={() => paint.changeRadius(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <button
            aria-label='Undo'
            data-size='icon-sm'
            data-variant='outline'
            disabled={!paint.canUndo}
            type='button'
            onClick={onUndo}
          >
            <Undo2Icon className='size-4' />
          </button>
          <button
            aria-label='Redo'
            data-size='icon-sm'
            data-variant='outline'
            disabled={!paint.canRedo}
            type='button'
            onClick={onRedo}
          >
            <Redo2Icon className='size-4' />
          </button>
          <button data-size='sm' data-variant='outline' type='button' onClick={onClear}>
            Clear
          </button>
        </div>
      </div>

      <div className='border-border bg-card relative overflow-hidden rounded-xl border'>
        <canvas ref={paint.ref} className='h-[300px] w-full cursor-crosshair touch-none' />

        {!paint.lines.length && !paint.drawing && (
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            <span className='text-muted-foreground text-sm'>Draw something here</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
