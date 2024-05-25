import React from 'react';

import { useKeysPressed } from './useKeysPressed';

const Demo = () => {
  const pressedKeys = useKeysPressed();

  return (
    <div>
      <p>Press any keyboard button</p>
      [&nbsp;{pressedKeys.map(({ key }) => key)}&nbsp;]
    </div>
  );
};

export default Demo;
