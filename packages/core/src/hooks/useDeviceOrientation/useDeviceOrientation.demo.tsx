import { useDeviceOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const deviceOrientation = useDeviceOrientation();

  return (
    <pre lang='json'>
      <b>Device orientation data:</b>
      <p>{JSON.stringify(deviceOrientation.value, null, 2)}</p>
    </pre>
  );
};

export default Demo;
