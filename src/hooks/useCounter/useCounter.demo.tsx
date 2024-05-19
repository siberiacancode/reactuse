import React from 'react';

import { useCounter } from './useCounter';

const Demo = () => {
  const { count, inc, dec, reset, set } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => inc()}>Increment</button>
      <button onClick={() => dec()}>Decrement</button>
      <button onClick={() => set(5)}>Set (5)</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Demo;
