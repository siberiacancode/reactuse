import { useState } from 'react';

import { useWindowEvent } from './useWindowEvent';

const Demo = () => {
  const [count, setCount] = useState(0);

  useWindowEvent('click', () => setCount(count + 1));

  return <p>Window click count: {count}</p>;
};

export default Demo;
