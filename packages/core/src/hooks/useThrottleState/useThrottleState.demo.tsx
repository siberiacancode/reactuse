import { useThrottleState } from '@siberiacancode/reactuse';

const Demo = () => {
  const [throttledCounterCount, setThrottledCounterCount] = useThrottleState(0, 1000);

  return (
    <div>
      <p>
        Value: <code>{throttledCounterCount}</code>
      </p>
      <p>
        Throttled value: <code>{throttledCounterCount}</code>
      </p>
      <button type='button' onClick={() => setThrottledCounterCount(throttledCounterCount + 1)}>
        Increment
      </button>
      <button type='button' onClick={() => setThrottledCounterCount(throttledCounterCount - 1)}>
        Decrement
      </button>
    </div>
  );
};

export default Demo;
