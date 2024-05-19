import React from 'react';

import { useClipboard } from './useClipboard';

const Demo = () => {
  const [value, copy] = useClipboard();

  return (
    <div>
      Clipboard: {value}
      <input placeholder='Set value' onChange={(event) => copy(event.target.value)} />
    </div>
  );
};

export default Demo;
