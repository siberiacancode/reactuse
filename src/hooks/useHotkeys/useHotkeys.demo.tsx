import React from 'react';

import { useHotkeys } from './useHotkeys';

const Demo = () => {
  const [count, setCount] = React.useState(0);
  useHotkeys('control+a', () => setCount(count + 1), { preventDefault: true });

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
