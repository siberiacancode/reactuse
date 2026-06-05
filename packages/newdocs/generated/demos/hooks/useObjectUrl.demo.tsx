'use client'

import { useObjectUrl } from '@siberiacancode/reactuse';
import { DownloadIcon, RefreshCwIcon, SparklesIcon } from 'lucide-react';
import { useRef } from 'react';

const COLORS = [
  '#0f172a',
  '#1e293b',
  '#475569',
  '#94a3b8',
  '#cbd5e1',
  '#7c2d12',
  '#c2410c',
  '#f97316',
  '#fdba74',
  '#fff7ed',
  '#064e3b',
  '#047857',
  '#10b981',
  '#6ee7b7',
  '#ecfdf5',
  '#1e1b4b',
  '#4338ca',
  '#818cf8',
  '#c7d2fe',
  '#eef2ff',
  '#831843',
  '#be185d',
  '#ec4899',
  '#f9a8d4',
  '#fdf2f8'
];

const COLS = 40;
const ROWS = 25;
const CELL = 14;
const GAP = 2;
const RADIUS = 4;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

const random = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const Demo = () => {
  const objectUrl = useObjectUrl();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const density = 0.4 + Math.random() * 0.25;

    context.clearRect(0, 0, WIDTH, HEIGHT);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (Math.random() > density) continue;

        context.fillStyle = random(COLORS);
        context.beginPath();
        context.roundRect(x * CELL + GAP / 2, y * CELL + GAP / 2, CELL - GAP, CELL - GAP, RADIUS);
        context.fill();
      }
    }

    canvas.toBlob((blob) => {
      if (blob) objectUrl.set(blob);
    }, 'image/png');
  };

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-4'>
      <canvas ref={canvasRef} className='hidden' height={HEIGHT} width={WIDTH} />

      {!objectUrl.value && (
        <div className='border-border flex aspect-[8/5] w-full flex-col items-center justify-center gap-4 rounded-2xl border p-8 text-center'>
          <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
            <SparklesIcon className='text-foreground size-7' />
          </div>

          <div className='flex flex-col gap-1'>
            <h2 className='text-foreground text-lg font-semibold'>Pixel art generator</h2>
            <p className='text-muted-foreground text-sm'>
              Generate a unique pixel pattern and download it as an image.
            </p>
          </div>

          <button type='button' onClick={generate}>
            <SparklesIcon className='size-4' />
            Generate
          </button>
        </div>
      )}

      {objectUrl.value && (
        <div className='border-border bg-muted relative aspect-[8/5] w-full overflow-hidden rounded-2xl border'>
          <img
            alt='Generated pixel art'
            className='size-full'
            src={objectUrl.value}
            style={{ imageRendering: 'pixelated' }}
          />

          <div className='absolute top-3 right-3 flex gap-2'>
            <a
              className='inline-flex h-8 items-center gap-1.5 rounded-full bg-black/60 px-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80'
              download='pixel-art.png'
              href={objectUrl.value}
            >
              <DownloadIcon className='size-4' />
              Download
            </a>

            <button
              aria-label='Regenerate'
              className='rounded-full! bg-black/60 text-white backdrop-blur-sm hover:bg-black/80!'
              data-size='icon'
              data-variant='unstyled'
              type='button'
              onClick={generate}
            >
              <RefreshCwIcon className='size-4' />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
