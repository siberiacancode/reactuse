import { useStopwatch } from './useStopwatch';

const Demo = () => {
  const stopwatch = useStopwatch();

  return (
    <div>
      <p>
        <code>{stopwatch.minutes} m</code>:<code>{stopwatch.seconds} s</code>
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
