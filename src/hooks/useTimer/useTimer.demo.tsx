import { useTimer } from './useTimer';

const time = new Date();
time.setSeconds(time.getSeconds() + 600);

const Demo = () => {
  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.warn('Timer is over')
  });

  return (
    <div>
      <h1>react-timer-hook </h1>
      <p>Timer Demo</p>
      <div>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button
        onClick={() => {
          const time = new Date();
          time.setSeconds(time.getSeconds() + 300);
          restart(time);
        }}
      >
        Restart
      </button>
    </div>
  );
};

export default Demo;
