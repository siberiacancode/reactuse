import { useCounter } from '../useCounter/useCounter';
import { useThrottleValue } from './useThrottleValue';

const Demo = () => {
  const counter = useCounter();

  const throttledCounterCount = useThrottleValue(counter.value, 1000);

  return (
    <div>
      <p>
        Value: <code>{counter.value}</code>
      </p>
      <p>
        Throttled value: <code>{throttledCounterCount}</code>
      </p>
      <button type='button' onClick={() => counter.inc()}>
        Increment
      </button>
      <button type='button' onClick={() => counter.dec()}>
        Decrement
      </button>
    </div>
  );
};

export default Demo;
