import { useDeviceMotion } from "./useDeviceMotion";

const Demo = () => {
  const deviceMotionData = useDeviceMotion(1000);

  return (
    <pre lang="json">
      <b>DeviceMotionEvent data:</b>
      <p>{JSON.stringify(deviceMotionData, null, 2)}</p>
    </pre>
  );
};

export default Demo;
