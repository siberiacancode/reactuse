import { useCounter } from '../useCounter/useCounter';

import { useDebouncedValue } from './useDebouncedValue';

const Demo = () => {
  const counter = useCounter();

  const debouncedCounterCount = useDebouncedValue(counter.count, 500);

  return (
    <div>
      <p>
        Value: <code>{counter.count}</code>
      </p>
      <p>
        Debounced value: <code>{debouncedCounterCount}</code>
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
