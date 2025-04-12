import { useState } from 'react';

import { useEventListener } from '@siberiacancode/reactuse';

const Demo = () => {
  const [count, setCount] = useState(0);

  useEventListener('click', () => setCount(count + 1));

  return (
    <p>
      Click count: <code>{count}</code>
    </p>
  );
};

export default Demo;
