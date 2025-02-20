import { useCounter } from '../useCounter/useCounter';
import { useThrottleCallback } from './useThrottleCallback';

const Demo = () => {
  const clickCounter = useCounter();
  const throttledCounter = useCounter();

  const throttledIncrement = useThrottleCallback(throttledCounter.inc, 1000);

  const onClick = () => {
    throttledIncrement();
    clickCounter.inc();
  };

  return (
    <div>
      <p>
        Button clicked: <code>{clickCounter.value}</code>
      </p>
      <p>
        Event handler called: <code>{throttledCounter.value}</code>
      </p>
      <p className='text-sm text-zinc-400'>Delay is set to 1000ms for this demo.</p>
      <button type='button' onClick={onClick}>
        Smash me my friend
      </button>
    </div>
  );
};

export default Demo;
