import React from 'react';

import { useTimeout } from './useTimeout';

const Demo = () => {
  const timeout = useTimeout(() => {}, 5000);

  return (
    <div>
      <p>{String(timeout.ready)}</p>
      <button onClick={timeout.clear}>clear</button>
    </div>
  );
};

export default Demo;
