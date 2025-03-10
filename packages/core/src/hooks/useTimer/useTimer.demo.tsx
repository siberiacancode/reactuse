import { useTimer } from './useTimer';

const Demo = () => {
  const timer = useTimer(3600);

  return (
    <>
      <p>
        Time{' '}
        <code>
          {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:
          {String(timer.seconds).padStart(2, '0')}
        </code>
      </p>
      <p>
        Timer running: <code>{String(timer.active)}</code>
      </p>

      <button type='button' onClick={timer.start}>
        Start
      </button>
      <button type='button' onClick={() => timer.restart(5000)}>
        Restart
      </button>
      <button type='button' onClick={timer.toggle}>
        Toggle
      </button>
      <button type='button' onClick={timer.pause}>
        Pause
      </button>
      <button type='button' onClick={timer.clear}>
        Clear
      </button>
    </>
  );
};

export default Demo;
