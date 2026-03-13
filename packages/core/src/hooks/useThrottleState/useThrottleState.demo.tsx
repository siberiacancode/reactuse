import { useThrottleState } from '@siberiacancode/reactuse';

const Demo = () => {
  const [throttledValue, setThrottledValue] = useThrottleState('', 500);

  return (
    <>
      <div>
        <label className='mb-2 block text-sm font-medium'>Enter value to see throttle effect</label>
        <input
          className='w-full'
          defaultValue={throttledValue}
          type='text'
          onChange={(event) => setThrottledValue(event.target.value)}
          placeholder='Enter value to see throttle effect'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>
          Throttled value: <code>{throttledValue || 'empty string'}</code>
        </div>
      </div>
    </>
  );
};

export default Demo;
