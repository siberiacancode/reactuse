import { useState } from 'react';

import { useDebounceEffect } from './useDebounceEffect';

const Demo = () => {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useDebounceEffect(
    () => {
      setDebouncedValue(value);
    },
    [value],
    500
  );

  return (
    <>
      <input
        className=''
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Type something...'
      />
      <p>Value: {value}</p>
      <p>Debounced value: {debouncedValue}</p>
    </>
  );
};

export default Demo;
