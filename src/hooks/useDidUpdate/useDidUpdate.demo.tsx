import { useEffect, useState } from 'react';

import { useCounter } from '../useCounter/useCounter';

import { useDidUpdate } from './useDidUpdate';

const Demo = () => {
  const counter = useCounter();
  const [useEffectTriggered, setUseEffectTriggered] = useState(false);
  const [useDidUpdateTriggered, setUseDidUpdateTriggered] = useState(false);

  useDidUpdate(() => {
    setUseDidUpdateTriggered(true);
  }, [counter.value]);

  useEffect(() => {
    setUseEffectTriggered(true);
  }, [counter.value]);

  return (
    <div>
      <p>
        Count: <code>{counter.value}</code>
      </p>
      <p>
        Use effect triggered: <code>{String(useEffectTriggered)}</code>
      </p>
      <p>
        Use non initial effect triggered: <code>{String(useDidUpdateTriggered)}</code>
      </p>

      <button type='button' onClick={() => counter.inc()}>
        Force update
      </button>
    </div>
  );
};

export default Demo;
