import { useState } from 'react';

import { useDocumentEvent } from '@siberiacancode/reactuse';

const Demo = () => {
  const [count, setCount] = useState(0);

  useDocumentEvent('click', () => setCount(count + 1));

  return <p>Document click count: {count}</p>;
};

export default Demo;
