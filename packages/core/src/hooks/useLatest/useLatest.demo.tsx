import { useCounter, useLatest } from '@siberiacancode/reactuse';
import { useEffect } from 'react';

const Demo = () => {
  const counter = useCounter();
  const latestCount = useLatest(counter.value);

  useEffect(() => {
    console.log('latestCount', latestCount.value);
    setInterval(() => {
      console.log('latestCount', latestCount.value);
    }, 1000);
  }, []);

  return (
    <div>
      <p>
        You clicked <code>{counter.value}</code> times, latest count is{' '}
        <code>{latestCount.value}</code>
      </p>

      <button className='button' type='button' onClick={() => counter.inc()}>
        Increment
      </button>
    </div>
  );
};

export default Demo;
