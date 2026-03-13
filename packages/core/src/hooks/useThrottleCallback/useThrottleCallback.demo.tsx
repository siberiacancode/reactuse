import { useCounter, useThrottleCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [squarePosition, setSquarePosition] = useState({ x: 0, y: 0 });
  const throttledCounter = useCounter(0);

  const throttledMove = useThrottleCallback((x: number, y: number) => {
    setSquarePosition({ x, y });
    throttledCounter.inc();
  }, 25);

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='text-sm'>Move your mouse in the area below</div>

        <div
          className='relative h-64 w-full border-2 border-dashed'
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) throttledMove(x, y);
          }}
        >
          <div
            style={{
              left: squarePosition.x - 8,
              top: squarePosition.y - 8
            }}
            className='absolute h-4 w-4 rounded bg-[var(--vp-c-brand-2)]'
          />
        </div>

        <div className='text-sm'>
          Throttle calls: <code>{throttledCounter.value}</code>
        </div>
      </div>
    </>
  );
};

export default Demo;
