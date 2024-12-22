import { useVibrate } from './useVibrate';

const Demo = () => {
  const { vibrating, vibrate, stop } = useVibrate({
    pattern: [300, 100, 200, 100, 1000, 300]
  });

  return (
    <>
      <h1>Vibration is <code>{vibrating ? 'vibrating' : 'not vibrating'}</code></h1>
      <p>Most modern mobile devices include vibration hardware, which lets software code provides physical feedback to the user by causing the device to shake.</p>

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
