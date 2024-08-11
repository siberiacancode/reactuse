import { useCounter } from '../useCounter/useCounter';

import { useDeviceMotion } from './useDeviceMotion';

const stringifyValue = (value: any) => JSON.stringify(value, null, 2);

const Demo = () => {
  const counter = useCounter(0);
  const getDeviceMotion = useDeviceMotion(1000);

  return (
    <>
      <button type='button' onClick={() => counter.inc()}>
        Refresh
      </button>
      <br />
      <pre lang='json'>
        <b>DeviceMotionEvent data:</b>
        <p>{stringifyValue(getDeviceMotion())}</p>
      </pre>
    </>
  );
};

export default Demo;
