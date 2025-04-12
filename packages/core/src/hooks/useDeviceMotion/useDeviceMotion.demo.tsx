import { useDeviceMotion } from '@siberiacancode/reactuse';

const Demo = () => {
  const deviceMotion = useDeviceMotion();

  return (
    <pre lang='json'>
      <b>Device motion data:</b>
      <p>{JSON.stringify(deviceMotion, null, 2)}</p>
    </pre>
  );
};

export default Demo;
