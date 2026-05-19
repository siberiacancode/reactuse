import { useDebounceValue } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounceValue(value, 500);

  return (
    <>
      <div>
        <label className='mb-2 block text-sm font-medium'>Enter value to see debounce effect</label>
        <input
          className='w-full'
          defaultValue={value}
          placeholder='Enter value to see debounce effect'
          type='text'
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>
          Value: <code>{value || 'empty string'}</code>
        </div>
        <div className='text-sm'>
          Debounced value: <code>{debouncedValue || 'empty string'}</code>
        </div>
      </div>
    </>
  );
};

export default Demo;
