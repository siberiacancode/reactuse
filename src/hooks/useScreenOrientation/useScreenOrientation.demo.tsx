import { useScreenOrientation } from './useScreenOrientation';

const Demo = () => {
  const screenOrientation = useScreenOrientation();

  return (
    <>
      <p>
        For best results, please use a mobile or tablet device or use your browsers native inspector
        to simulate an orientation change
      </p>

      <div>
        Orientation Type: <code>{screenOrientation.value.orientationType}</code>
      </div>
      <div>
        Orientation Angle: <code>{screenOrientation.value.angle}</code>
      </div>
    </>
  );
};

export default Demo;
