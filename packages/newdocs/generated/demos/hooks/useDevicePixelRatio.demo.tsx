'use client'

import { useDevicePixelRatio } from '@siberiacancode/reactuse';

const getDisplayLabel = (ratio: number) => {
  if (ratio < 1) return 'Low DPI';
  if (ratio === 1) return 'Standard';
  if (ratio <= 2) return 'Retina';
  return 'Super Retina';
};

const Demo = () => {
  const devicePixelRatio = useDevicePixelRatio();

  if (!devicePixelRatio.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  const gridLines = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      <div className='border-border bg-card relative flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-lg border'>
        <svg className='absolute inset-0' height='200' viewBox='0 0 200 200' width='200'>
          <g className='text-border' stroke='currentColor' strokeWidth='0.5'>
            {gridLines.map((pos) => (
              <line key={`v-${pos}`} x1={pos * 2} x2={pos * 2} y1={0} y2={200} />
            ))}
            {gridLines.map((pos) => (
              <line key={`h-${pos}`} x1={0} x2={200} y1={pos * 2} y2={pos * 2} />
            ))}
          </g>
        </svg>

        <div className='relative flex flex-col items-center gap-1'>
          <span className='text-foreground font-mono text-5xl font-semibold tabular-nums'>
            {devicePixelRatio.value.toFixed(2)}x
          </span>
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.15em] uppercase'>
            {getDisplayLabel(devicePixelRatio.value)}
          </span>
        </div>
      </div>

      <p className='text-muted-foreground text-center text-xs'>Try zooming the page in and out</p>
    </section>
  );
};

export default Demo;
