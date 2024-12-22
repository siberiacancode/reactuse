import { useVibrate } from './useVibrate';

const Demo = () => {
  const { active, vibrate, stop } = useVibrate([300, 100, 200, 100, 1000, 300]);

  return (
    <>
      <h1>Vibration is <code>{active ? 'vibrating' : 'not vibrating'}</code></h1>
      <p>Most modern mobile devices include vibration hardware, which lets software code provides physical feedback to the user by causing the device to shake.</p>
      <button disabled={active} type='button' onClick={() => vibrate()}>
        Vibrate
      </button>
      <button disabled={!active} type='button' onClick={stop}>
        Stop
      </button>
    </>
  );
};

export default Demo;
