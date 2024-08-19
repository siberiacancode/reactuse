import { useDeviceMotion } from './useDeviceMotion';

const Demo = () => {
  const deviceMotionData = useDeviceMotion();

  return (
    <pre lang='json'>
      <b>Device motion data:</b>
      <p>{JSON.stringify(deviceMotionData, null, 2)}</p>
    </pre>
  );
};

export default Demo;
