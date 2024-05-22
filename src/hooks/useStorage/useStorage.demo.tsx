import React from 'react';

import { useStorage } from './useStorage';

const Demo = () => {
  const textStore = useStorage('siberiacancode-use-storage', 'default text');

  return (
    <div>
      <p>{textStore.value}</p>
      <input
        type='text'
        value={textStore.value}
        onChange={(event) => textStore.set(event.target.value)}
      />
    </div>
  );
};

export default Demo;
