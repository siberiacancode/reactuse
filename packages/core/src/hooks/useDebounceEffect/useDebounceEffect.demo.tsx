import { useDebounceEffect, useField } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const inputField = useField();
  const [list, setList] = useState<string[]>([]);

  const inputValue = inputField.watch();

  useDebounceEffect(
    () => {
      setList((currentList) => [...currentList, inputValue]);
    },
    500,
    [inputValue]
  );

  return (
    <>
      <div>Write to see the debounce effect</div>
      <input {...inputField.register()} />
      <ul className='text-sm'>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
};

export default Demo;
