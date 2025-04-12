import { useEffect, useState } from 'react';
import { useCounter, useDidUpdate } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const [useEffectTriggered, setUseEffectTriggered] = useState(false);
  const [useDidUpdateTriggered, setUseDidUpdateTriggered] = useState(false);

  useDidUpdate(() => setUseDidUpdateTriggered(true), [counter.value]);

  useEffect(() => {
    setUseEffectTriggered(true);
  }, [counter.value]);

  return (
    <div>
      <p>
        Count: <code>{counter.value}</code>
      </p>
      <p>
        <small>
          Use effect triggered: <code>{String(useEffectTriggered)}</code>, use non initial effect
          triggered: <code>{String(useDidUpdateTriggered)}</code>
        </small>
      </p>
      <button type='button' onClick={() => counter.inc()}>
        Update
      </button>
    </div>
  );
};

export default Demo;
