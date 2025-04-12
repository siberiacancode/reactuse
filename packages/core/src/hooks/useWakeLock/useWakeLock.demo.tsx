import { useState } from 'react';
import { useWakeLock } from './useWakeLock';

const Demo = () => {
  const [autoReacquire, setAutoReacquire] = useState<boolean>(false);

  const { active, supported, request, release } = useWakeLock({
    autoReacquire,
    onRequest: () => console.log('Wake lock acquired'),
    onRelease: () => console.log('Wake lock released'),
    onError: (error) => console.error('Wake lock error:', error)
  });

  return (
    <>
      <p>
        Screen Wake Lock API: <code>{supported ? 'supported' : 'not supported'}</code>
      </p>
      <p>
        Active: <code>{active ? 'yes' : 'no'}</code>
      </p>
      <p className='flex gap-2'>
        Auto reacquire:{' '}
        <label className='flex gap-1'>
          <input
            checked={autoReacquire}
            name='autoReacquire'
            type='radio'
            value='true'
            onChange={() => setAutoReacquire(true)}
          />
          Yes
        </label>
        <label className='flex gap-1'>
          <input
            checked={!autoReacquire}
            name='autoReacquire'
            type='radio'
            value='false'
            onChange={() => setAutoReacquire(false)}
          />
          No
        </label>
      </p>
      <div>
        <button onClick={request} disabled={!supported || active}>
          Acquire Wake Lock
        </button>
        <button onClick={release} disabled={!active}>
          Release Wake Lock
        </button>
      </div>
    </>
  );
};

export default Demo;
