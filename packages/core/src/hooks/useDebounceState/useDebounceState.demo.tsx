import { useDebounceState } from '@siberiacancode/reactuse';

const Demo = () => {
  const [debouncedCounterCount, setDebouncedCounterCount] = useDebounceState(0, 500);

  return (
    <div>
      <p>
        Value: <code>{debouncedCounterCount}</code>
      </p>
      <p>
        Debounced value: <code>{debouncedCounterCount}</code>
      </p>
      <button type='button' onClick={() => setDebouncedCounterCount(debouncedCounterCount + 1)}>
        Increment
      </button>
      <button type='button' onClick={() => setDebouncedCounterCount(debouncedCounterCount - 1)}>
        Decrement
      </button>
    </div>
  );
};

export default Demo;
