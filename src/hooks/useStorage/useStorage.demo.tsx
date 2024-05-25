import React from 'react';

import { useStorage } from './useStorage';

const Demo = () => {
  const [text, setText, removeText] = useStorage('siberiacancode-use-storage', '');

  return (
    <div>
      <p>Value: {String(text)}</p>
      <input type='text' value={text ?? ''} onChange={(event) => setText(event.target.value)} />
      <button type='button' onClick={removeText}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
