import React from 'react';

import { useCounter } from '../useCounter/useCounter';

import { useDidUpdate } from './useDidUpdate';

const Demo = () => {
  const counter = useCounter();
  const [useEffectTriggered, setUseEffectTriggered] = React.useState(false);
  const [useDidUpdateTriggered, setUseDidUpdateTriggered] = React.useState(false);

  useDidUpdate(() => {
    setUseDidUpdateTriggered(true);
  }, [counter.count]);

  React.useEffect(() => {
    setUseEffectTriggered(true);
  }, [counter.count]);

  return (
    <div>
      <p>
        Count: <code>{counter.count}</code>
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
