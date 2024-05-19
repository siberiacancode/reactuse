import React from 'react';

import { useBoolean } from './useBoolean';

const Demo = () => {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <p>Value: {on.toString()}</p>
      <button onClick={() => toggle()}>Toggle</button>
      <button onClick={() => toggle(true)}>Set (true)</button>
      <button onClick={() => toggle(false)}>Set (false)</button>
    </div>
  );
};

export default Demo;
