import React from 'react';

import { useCounter } from '@/hooks';

import { useCookie } from './useCookie';

const Demo = () => {
  const { value, updateCookie, removeCookie } = useCookie('my-cookie');
  const { count, inc } = useCounter(1);

  React.useEffect(() => {
    removeCookie();
  }, []);

  const updateCookieHandler = () => {
    updateCookie(`my-awesome-cookie-${count}`);
    inc();
  };

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={updateCookieHandler}>Update Cookie</button>
      <br />
      <button onClick={removeCookie}>Delete Cookie</button>
    </div>
  );
};

export default Demo;
