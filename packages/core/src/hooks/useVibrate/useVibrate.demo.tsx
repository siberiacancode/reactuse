import { useVibrate } from '@siberiacancode/reactuse';

const Demo = () => {
  const vibrate = useVibrate([300, 100, 200, 100, 1000, 300]);

  if (!vibrate.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <>
      <h1>Vibration</h1>
      <p>
        Most modern mobile devices include vibration hardware, which lets software code provides
        physical feedback to the user by causing the device to shake.
      </p>
      <button type='button' onClick={() => vibrate.trigger()}>
        Vibrate
      </button>
    </>
  );
};

export default Demo;
