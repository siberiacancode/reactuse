import { useDidUpdate, useDocumentVisibility, useTimer } from '@siberiacancode/reactuse';
import { useState } from 'react';

const START_MESSAGE = '💡 Minimize the page or switch tab then return';

const Demo = () => {
  const [message, setMessage] = useState(START_MESSAGE);
  const documentVisibility = useDocumentVisibility();

  const timer = useTimer(3000, () => {
    setMessage(START_MESSAGE);
  });

  useDidUpdate(() => {
    if (documentVisibility === 'visible') {
      setMessage('🎉 Welcome back!');
      timer.start();
    }
  }, [documentVisibility]);

  return <p>{message}</p>;
};

export default Demo;
