import { useWindowEvent } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [count, setCount] = useState(0);

  useWindowEvent('click', () => setCount(count + 1));

  return (
    <p>
      Window click count: <code>{count}</code>
    </p>
  );
};

export default Demo;
