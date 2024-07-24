import { useCounter } from '../useCounter/useCounter';

import { useRafCallback } from './useRafCallback';

const Demo = () => {
  const counter = useCounter();
  const { isActive, resume, pause } = useRafCallback(() => counter.inc());

  return (
    <>
      <p>
        Count: <code>{counter.value}</code>
      </p>

      {isActive ? (
        <button type='button' onClick={pause}>
          Pause
        </button>
      ) : (
        <button type='button' onClick={resume}>
          Resume
        </button>
      )}
    </>
  );
};

export default Demo;
