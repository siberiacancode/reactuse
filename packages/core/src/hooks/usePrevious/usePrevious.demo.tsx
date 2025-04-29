import { usePrevious } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <>
      <p>
        Value now: <code>{count}</code>, value before: <code>{prevCount ?? 'undefined'}</code>
      </p>
      <button type='button' onClick={() => setCount(count + 1)}>
        +
      </button>
      <button type='button' onClick={() => setCount(count - 1)}>
        -
      </button>
    </>
  );
};

export default Demo;
