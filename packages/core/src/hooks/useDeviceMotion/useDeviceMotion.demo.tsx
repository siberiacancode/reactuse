import { useDeviceMotion } from '@siberiacancode/reactuse';
import { SmartphoneIcon } from 'lucide-react';

const CIRCLE_SIZE = 240;
const BUBBLE_SIZE = 22;
const MAX_OFFSET = CIRCLE_SIZE / 2 - BUBBLE_SIZE / 2 - 12;
const GRAVITY = 9.8;
const LEVEL_THRESHOLD = 2;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Demo = () => {
  const deviceMotion = useDeviceMotion();
  const value = deviceMotion.watch();

  const x = value.accelerationIncludingGravity.x;
  const y = value.accelerationIncludingGravity.y;
  const hasData = x !== null && y !== null;

  const offsetX = hasData ? clamp((-x / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET) : 0;
  const offsetY = hasData ? clamp((y / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET) : 0;

  const tiltX = hasData ? (-x / GRAVITY) * 90 : 0;
  const tiltY = hasData ? (y / GRAVITY) * 90 : 0;

  const isLevel = hasData && Math.abs(tiltX) < LEVEL_THRESHOLD && Math.abs(tiltY) < LEVEL_THRESHOLD;

  const cx = CIRCLE_SIZE / 2;
  const cy = CIRCLE_SIZE / 2;
  const r = cx - 8;

  const formatTilt = (v: number) => {
    const sign = v < 0 ? '-' : '';
    return `${sign}${Math.abs(v).toFixed(1)} deg`;
  };

  return (
    <section className='flex flex-col items-center gap-6 p-4'>
      <div className='relative' style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} width={CIRCLE_SIZE}>
          <g className='text-border' stroke='currentColor' strokeLinecap='round' strokeWidth='1'>
            <line x1={cx} x2={cx} y1={0} y2={CIRCLE_SIZE} />
            <line x1={0} x2={CIRCLE_SIZE} y1={cy} y2={cy} />
          </g>

          <circle
            className='text-border'
            cx={cx}
            cy={cy}
            fill='transparent'
            r={r}
            stroke='currentColor'
            strokeWidth='1.5'
          />

          {hasData && (
            <circle
              className={isLevel ? 'fill-green-500' : 'fill-foreground'}
              cx={cx + offsetX}
              cy={cy + offsetY}
              r={BUBBLE_SIZE / 2}
              style={{ transition: 'all 120ms ease-out, fill 200ms ease-out' }}
            />
          )}
        </svg>

        {isLevel && (
          <div className='pointer-events-none absolute inset-x-0 -bottom-8 text-center'>
            <span className='font-mono text-xs font-semibold tracking-[0.2em] text-green-500'>
              LEVEL
            </span>
          </div>
        )}

        {!hasData && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center'>
            <SmartphoneIcon className='text-muted-foreground size-8' />
            <p className='text-muted-foreground text-xs'>
              Open on a mobile device to see the bubble move.
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className='text-foreground flex items-center gap-3 pt-4 font-mono text-sm tracking-wider tabular-nums'>
          <span>X {formatTilt(tiltX)}</span>
          <span className='text-muted-foreground'>|</span>
          <span>Y {formatTilt(tiltY)}</span>
        </div>
      )}
    </section>
  );
};

export default Demo;
