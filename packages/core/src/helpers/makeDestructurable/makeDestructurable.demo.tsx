import { useState } from 'react';

import { makeDestructurable } from './makeDestructurable';

const useCounter = (initialValue = 0) => {
  const [value, setValue] = useState(initialValue);

  const inc = (step = 1) => setValue((currentValue) => currentValue + step);
  const dec = (step = 1) => setValue((currentValue) => currentValue - step);

  return makeDestructurable(
    {
      value,
      inc,
      dec
    },
    [value, { inc, dec }] as const
  );
};

const Demo = () => {
  const [counterValue, handlers] = useCounter();

  return (
    <>
      <p>
        Count: <code>{counterValue}</code>
      </p>
      <button type='button' onClick={() => handlers.inc()}>
        Increment
      </button>
      <button type='button' onClick={() => handlers.dec()}>
        Decrement
      </button>
    </>
  );
};

export default Demo;
