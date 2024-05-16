import React from 'react';

import { useCounter } from './useCounter';

const Demo = () => {
  const { count, inc, dec, reset, set } = useCounter();

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => inc()}>inc</button>
      <button onClick={() => dec()}>dec</button>
      <button onClick={reset}>reset</button>
      <button onClick={() => set(5)}>set 5</button>
    </div>
  );
};

export default Demo;
