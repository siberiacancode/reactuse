import { useCounter } from './useCounter';

const Demo = () => {
  const { count, inc, dec, reset, set } = useCounter();

  return (
    <>
      <p>
        Count: <code>{count}</code>
      </p>
      <button type='button' onClick={() => inc()}>
        Increment
      </button>
      <button type='button' onClick={() => dec()}>
        Decrement
      </button>
      <button type='button' onClick={() => set(5)}>
        Set (5)
      </button>
      <button type='button' onClick={reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
