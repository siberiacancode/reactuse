import { useCounter, useDebounceEffect } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const debounceCounter = useCounter();
  const effectCounter = useCounter();

  useDebounceEffect(
    () => {
      debounceCounter.inc();
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
          Debounced count: <code>{debounceCounter.value}</code>
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

      <div className='mt-4 text-xs'>Click buttons rapidly to see the debounce effect.</div>
    </>
  );
};

export default Demo;
