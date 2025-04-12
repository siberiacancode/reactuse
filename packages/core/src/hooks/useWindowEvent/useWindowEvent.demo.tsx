import { useState } from 'react';

import { useWindowEvent } from '@siberiacancode/reactuse';

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
