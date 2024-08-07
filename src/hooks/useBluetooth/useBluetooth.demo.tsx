import { useBluetooth } from './useBluetooth';

const Demo = () => {
  const { isSupported, requestDevice, error } = useBluetooth({
    acceptAllDevices: true
  });

  if (!isSupported) {
    return (
      <p>
        Bluetooth Web API:
        <code>not supported</code>
      </p>
    );
  }

  return (
    <>
      <p>
        Bluetooth Web API: <code>supported</code>
      </p>
      <button onClick={requestDevice}>Click</button>
      <p>{error && `Error: ${error}`}</p>
    </>
  );
};

export default Demo;
