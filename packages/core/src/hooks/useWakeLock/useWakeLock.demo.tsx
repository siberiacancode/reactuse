import { useWakeLock } from '@siberiacancode/reactuse';

const Demo = () => {
  const wakeLock = useWakeLock();

  if (!wakeLock.supported) return <p>Api not supported, make sure to check for compatibility with different browsers when using this <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/WakeLock">api</a></p>;

  return (
    <>
      <p>
        Is active: <code>{wakeLock.active ? 'yes' : 'no'}</code>
      </p>

      <button onClick={() => !wakeLock.active ? wakeLock.request() : wakeLock.release()}>
        {!wakeLock.active ? 'On' : 'Off'}
      </button>
    </>
  );
};

export default Demo;
