import { useCounter } from '../useCounter/useCounter';
import { useLatest } from './useLatest';

const Demo = () => {
  const counter = useCounter();
  const latestCount = useLatest(counter.value);

  return (
    <div>
      <p>
        You clicked <code>{counter.value}</code> times, latest count is <code>{latestCount}</code>
      </p>

      <button className='button' type='button' onClick={() => counter.inc()}>
        Increment
      </button>
    </div>
  );
};

export default Demo;
