import { useCounter, useDebounceCallback } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();

  const debouncedCounterInc = useDebounceCallback(counter.inc, 500);
  const debouncedCounterDec = useDebounceCallback(counter.dec, 500);

  return (
    <div>
      <p>
        Value: <code>{counter.value}</code>
      </p>
      <button type='button' onClick={() => debouncedCounterInc()}>
        Debounced increment
      </button>
      <button type='button' onClick={() => debouncedCounterDec()}>
        Debounced decrement
      </button>
    </div>
  );
};

export default Demo;
