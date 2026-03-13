import { useDebounceState } from '@siberiacancode/reactuse';

const Demo = () => {
  const [debouncedValue, setDebouncedValue] = useDebounceState('', 500);

  return (
    <>
      <div>
        <label className='mb-2 block text-sm font-medium'>Enter value to see debounce effect</label>
        <input
          className='w-full'
          defaultValue={debouncedValue}
          type='text'
          onChange={(event) => setDebouncedValue(event.target.value)}
          placeholder='Enter value to see debounce effect'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>
          Debounced value: <code>{debouncedValue || 'empty string'}</code>
        </div>
      </div>
    </>
  );
};

export default Demo;
