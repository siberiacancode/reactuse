import { useLastChanged } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [inputValue, setInputValue] = useState('');
  const value = useLastChanged(inputValue);

  return (
    <div>
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder='Type something...'
      />
      <p>Last changed: {value}</p>
    </div>
  );
};

export default Demo;
