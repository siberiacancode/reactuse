import { useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useTimer } from '../useTimer/useTimer';
import { useDocumentVisibility } from './useDocumentVisibility';

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
