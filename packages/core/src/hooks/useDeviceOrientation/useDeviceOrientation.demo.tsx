import { useDeviceOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const deviceOrientation = useDeviceOrientation();

  if (!deviceOrientation.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/DeviceOrientationEvent'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <pre lang='json'>
      <b>Device orientation data:</b>
      <p>{JSON.stringify(deviceOrientation.value, null, 2)}</p>
    </pre>
  );
};

export default Demo;
