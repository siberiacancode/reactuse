import { useDeviceMotion } from '@siberiacancode/reactuse';
import { MoveHorizontalIcon, MoveVerticalIcon } from 'lucide-react';

const CIRCLE_SIZE = 200;
const BUBBLE_SIZE = 24;
const MAX_OFFSET = CIRCLE_SIZE / 2 - BUBBLE_SIZE / 2 - 8;
const GRAVITY = 9.8;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Demo = () => {
  const deviceMotion = useDeviceMotion();
  const value = deviceMotion.watch();

  const x = value.accelerationIncludingGravity.x;
  const y = value.accelerationIncludingGravity.y;

  if (!x || !y) {
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/DeviceMotionEvent'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );
  }

  const offsetX = clamp((-x / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);
  const offsetY = clamp((y / GRAVITY) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);

  const tiltX = ((-x / GRAVITY) * 90).toFixed(1);
  const tiltY = ((y / GRAVITY) * 90).toFixed(1);

  return (
    <section className='flex flex-col items-center p-4'>
      <div className='relative' style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} width={CIRCLE_SIZE}>
          <circle
            className='text-border'
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            fill='transparent'
            r={CIRCLE_SIZE / 2 - 1}
            stroke='currentColor'
            strokeWidth='2'
          />

          <line
            className='text-border'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='1'
            x1='20'
            x2={CIRCLE_SIZE - 20}
            y1={CIRCLE_SIZE / 2}
            y2={CIRCLE_SIZE / 2}
          />
          <line
            className='text-border'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='1'
            x1={CIRCLE_SIZE / 2}
            x2={CIRCLE_SIZE / 2}
            y1='20'
            y2={CIRCLE_SIZE - 20}
          />

          <circle
            className='text-border'
            cx={CIRCLE_SIZE / 2 + offsetX}
            cy={CIRCLE_SIZE / 2 + offsetY}
            fill='white'
            r={BUBBLE_SIZE / 2}
            stroke='currentColor'
            strokeWidth='1'
            style={{ transition: 'all 100ms ease-out' }}
          />
        </svg>

        <div className='absolute top-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[10px] text-neutral-400'>
          <MoveVerticalIcon className='size-3' />
          {tiltY}°
        </div>

        <div className='absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400'>
          <MoveHorizontalIcon className='size-3' />
          {tiltX}°
        </div>
      </div>
    </section>
  );
};

export default Demo;
