import { useState } from 'react';
import { useBluetooth } from '@siberiacancode/reactuse';

const Demo = () => {
  const [error, setError] = useState<string>();
  const bluetooth = useBluetooth({
    acceptAllDevices: true
  });

  const onRequestDeviceClick = async () => {
    try {
      setError(undefined);
      await bluetooth.requestDevice();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  if (!bluetooth.supported) return <p>Api not supported, make sure to check for compatibility with different browsers when using this <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/bluetooth">api</a></p>;

  return (
    <>
      <p>Bluetooth Web API supported</p>
      {bluetooth.connected && (
        <div className='rounded-md bg-green-500 p-3 text-white'>
          <p>Connected</p>
        </div>
      )}

      {!bluetooth.connected && (
        <div className='rounded-md bg-orange-800 p-3 text-white'>
          <p>Not Connected</p>
        </div>
      )}
      <button type='button' onClick={onRequestDeviceClick}>
        Request device
      </button>
      {error && (
        <p>
          Errors: <code className='block whitespace-pre p-5'>{error}</code>
        </p>
      )}
    </>
  );
};

export default Demo;
