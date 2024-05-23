import React from 'react';

import { useDebouncedValue } from './useDebouncedValue';

const Demo = () => {
  const [debouncedCount, setDebouncedCount] = useDebouncedValue(0, 500);

  const [text, setText] = React.useState('');
  const [debouncedText] = useDebouncedValue(text, 1000);

  React.useEffect(() => {
    console.log('@');
  }, [debouncedText]);

  return (
    <div>
      <div>Count: {debouncedCount}</div>
      <button type='button' onClick={() => setDebouncedCount(debouncedCount + 1)}>
        increment with debounce
      </button>

      <div>Text: {text}</div>
      <input type='text' value={text} onChange={(e) => setText(e.target.value)} />

      <div>Debounced Text: {debouncedText}</div>
    </div>
  );
};

export default Demo;
