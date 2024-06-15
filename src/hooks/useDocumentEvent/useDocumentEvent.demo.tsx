import React from 'react';

import { useDocumentEvent } from './useDocumentEvent';

const Demo = () => {
  const [count, setCount] = React.useState(0);

  useDocumentEvent('click', () => setCount(count + 1));

  return <p>Document click count: {count}</p>;
};

export default Demo;
