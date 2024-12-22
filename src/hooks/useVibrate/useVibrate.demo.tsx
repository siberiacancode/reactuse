import { useVibrate } from './useVibrate';

const Demo = () => {
  const vibrate = useVibrate([300, 100, 200, 100, 1000, 300]);

  return (
    <>
      <p>Most modern mobile devices include vibration hardware, which lets software code provides physical feedback to the user by causing the device to shake.</p>
      <button type='button' onClick={() => vibrate.trigger()}>
        Vibrate
      </button>
    </>
  );
};

export default Demo;
