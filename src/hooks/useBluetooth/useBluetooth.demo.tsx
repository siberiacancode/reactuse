import { useBluetooth } from './useBluetooth';

const Demo = () => {
  const { isSupported, requestDevice } = useBluetooth({
    acceptAllDevices: true
  });

  if (!isSupported) {
    return (
      <p>
        Bluetooth:
        <code>not supported</code>
      </p>
    );
  }

  return (
    <>
      <p>
        Bluetooth sensor: <code>{isSupported && 'supported'}</code>
      </p>
      <button onClick={requestDevice}>Click</button>
    </>
  );
};

export default Demo;
