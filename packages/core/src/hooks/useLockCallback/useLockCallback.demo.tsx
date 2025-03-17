import { useState } from 'react';

import { useLockCallback } from './useLockCallback';

const Demo = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClick = useLockCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCount((prevCount) => prevCount + 1);
    setLoading(false);
  });

  return (
    <div>
      <div>
        <p>
          Count: <code>{count}</code>
        </p>
      </div>

      <p className='text-sm'>
        The callback is locked until the async operation completes{' '}
        <code>{loading ? 'loading' : 'idle'}</code>
      </p>

      <button type='button' onClick={handleClick}>
        Increment
      </button>
    </div>
  );
};

export default Demo;
