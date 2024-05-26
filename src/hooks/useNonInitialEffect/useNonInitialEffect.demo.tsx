import React from 'react';

import { useCounter } from '../useCounter/useCounter';

import { useNonInitialEffect } from './useNonInitialEffect';

const Demo = () => {
  const counter = useCounter();
  const [useEffectTriggered, setUseEffectTriggered] = React.useState(false);
  const [useNonInitialEffectTriggered, setUseNonInitialEffectTriggered] = React.useState(false);

  useNonInitialEffect(() => {
    setUseNonInitialEffectTriggered(true);
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
        Use non initial effect triggered: <code>{String(useNonInitialEffectTriggered)}</code>
      </p>

      <button type='button' onClick={() => counter.inc()}>
        Force update
      </button>
    </div>
  );
};

export default Demo;
