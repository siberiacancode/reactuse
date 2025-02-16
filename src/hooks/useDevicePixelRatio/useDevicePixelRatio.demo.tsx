import { useDevicePixelRatio } from './useDevicePixelRatio';

const Demo = () => {
  const { supported, ratio } = useDevicePixelRatio();

  if (!supported) {
    return <p>Device pixel ratio is not supported.</p>;
  }

  return <p>Device pixel ratio (try to zoom page in and out): {ratio}</p>;
};

export default Demo;
