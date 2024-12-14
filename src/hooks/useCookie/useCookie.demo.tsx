import React from 'react';

import { useCounter } from '@/hooks';

import { useCookie } from './useCookie';

const Demo = () => {
  const { value, set, remove } = useCookie('my-cookie');
  const { count, inc } = useCounter(1);

  React.useEffect(() => {
    remove();
  }, []);

  const setCookieHandler = () => {
    set(`my-awesome-cookie-${count}`);
    inc();
  };

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={setCookieHandler}>Update Cookie</button>
      <br />
      <button onClick={remove}>Delete Cookie</button>
    </div>
  );
};

export default Demo;
