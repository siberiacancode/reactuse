import { useCounter, useThrottleEffect } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const throttledCounter = useCounter();
  const effectCounter = useCounter();

  useThrottleEffect(
    () => {
      throttledCounter.inc();
      effectCounter.inc();
    },
    500,
    [counter.value]
  );

  return (
    <>
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>
          Current count: <code>{counter.value}</code>
        </div>
        <div className='text-sm'>
          Throttled count: <code>{throttledCounter.value}</code>
        </div>
        <div className='text-sm'>
          Effect runs: <code>{effectCounter.value}</code>
        </div>
      </div>

      <div className='mt-4 flex flex-wrap'>
        <button type='button' onClick={() => counter.inc()}>
          Increment
        </button>
        <button type='button' onClick={() => counter.dec()}>
          Decrement
        </button>
      </div>

      <div className='mt-4 text-xs'>Click buttons rapidly to see the throttle effect.</div>
    </>
  );
};

export default Demo;
