import { useFps } from './useFps';

const Demo = () => {
  const fps = useFps();

  return (
    <p>
      FPS: <code>{fps}</code>
    </p>
  );
};

export default Demo;
