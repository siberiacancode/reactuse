import { useCounter } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();

  return (
    <>
      <p>
        Count: <code>{counter.value}</code>
      </p>
      <button type='button' onClick={() => counter.inc()}>
        Increment
      </button>
      <button type='button' onClick={() => counter.dec()}>
        Decrement
      </button>
      <button type='button' onClick={() => counter.set(5)}>
        Set (5)
      </button>
      <button type='button' onClick={counter.reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
