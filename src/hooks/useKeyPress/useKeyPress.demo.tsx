import React from 'react';

import { useKeyPress } from './useKeyPress';

const Demo = () => {
  const pressedKeys = useKeyPress('a');

  return (
    <div>
      <p>Press A keyboard button</p>
      [&nbsp;{pressedKeys && "You pressed 'a' button"}&nbsp;]
    </div>
  );
};

export default Demo;
