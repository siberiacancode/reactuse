import { useState } from 'react';

import { useLockFn } from '@/hooks';

const mockApiRequest = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const Demo = () => {
  const [count, setCount] = useState(0);

  const submit = useLockFn(async () => {
    console.info('Start to submit');
    await mockApiRequest();
    setCount((val) => val + 1);
    console.info('Submit finished');
  });

  return (
    <>
      <p>Submit count: {count}</p>
      <button onClick={submit}>Submit</button>
    </>
  );
};

export default Demo;
