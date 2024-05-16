import React from 'react';

import { useBoolean } from './useBoolean';

const Demo = () => {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <label>
        <input onChange={() => toggle()} type='checkbox' checked={on} />
        <span>{on ? 'On' : 'Off'}</span>
      </label>
    </div>
  );
};

export default Demo;
