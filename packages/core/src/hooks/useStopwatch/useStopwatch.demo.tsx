import { useStopwatch } from '@siberiacancode/reactuse';

const Demo = () => {
  const stopwatch = useStopwatch({
    updateInterval: 100
  });

  return (
    <div>
      <p>
        <code>{stopwatch.minutes} m</code>:<code>{stopwatch.seconds} s</code>:
        <code>{String(stopwatch.milliseconds).padStart(3, '0')} ms</code>
      </p>
      <button type='button' onClick={stopwatch.start}>
        Start
      </button>
      <button type='button' onClick={stopwatch.pause}>
        Pause
      </button>
      <button type='button' onClick={stopwatch.reset}>
        Reset
      </button>
    </div>
  );
};

export default Demo;
