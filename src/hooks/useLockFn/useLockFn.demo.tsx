import { useState } from 'react';

import { useLockFn } from '@/hooks/useLockFn/useLockFn';

const mockApiRequest = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const Demo = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const submit = useLockFn(async () => {
    setMessage('Start to submit');
    await mockApiRequest();
    setCount((val) => val + 1);
    setMessage('Submit finished');
  });

  return (
    <>
      <p>Submit count: {count}</p>
      {message && <p>Message: {message}</p>}
      <button onClick={submit}>Submit</button>
    </>
  );
};

export default Demo;
