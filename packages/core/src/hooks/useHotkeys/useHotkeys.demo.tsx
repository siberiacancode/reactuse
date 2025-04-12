import { useState } from 'react';

import { useHotkeys } from '@siberiacancode/reactuse';

const Demo = () => {
  const [count, setCount] = useState(0);
  useHotkeys('control+a', () => setCount(count + 1));

  return (
    <div>
      <p>
        Press hot keys <code>ctrl left</code> + <code>a</code>{' '}
      </p>
      <p>
        Count of key presses: <code>{count}</code>
      </p>
    </div>
  );
};

export default Demo;
