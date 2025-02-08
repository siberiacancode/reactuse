import { useState } from 'react';

import { useLastChanged } from './useLastChanged';

const Demo = () => {
  const [inputValue, setInputValue] = useState('');
  const value = useLastChanged(inputValue);

  return (
    <div>
      <input
        placeholder='Type something...'
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <p>Last changed: {value}</p>
    </div>
  );
};

export default Demo;
