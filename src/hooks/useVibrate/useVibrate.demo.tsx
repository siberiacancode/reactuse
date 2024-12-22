import { useVibrate } from './useVibrate';

const Demo = () => {
  const { vibrating, vibrate, stop } = useVibrate({
    pattern: [300, 100, 200, 100, 1000, 300]
  });

  return (
    <>
      <p>Vibration is <code>{vibrating ? 'vibrating' : 'not vibrating'}</code></p>
      <button disabled={vibrating} type='button' onClick={() => vibrate()}>
        Vibrate
      </button>
      <button type='button' onClick={stop}>
        Stop
      </button>
    </>
  );
};

export default Demo;
