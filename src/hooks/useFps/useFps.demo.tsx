import { useFps } from './useFps';

const Demo: React.FC = () => {
  const fps = useFps();

  return (
    <div>
      <p>FPS: {fps}</p>
    </div>
  );
};

export default Demo;
