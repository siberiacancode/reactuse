import { useOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const { angle, type } = useOrientation();

  return (
    <>
      <p>
        Angle: <code>{angle}</code>
      </p>
      <p>
        Type: <code>{type}</code>
      </p>
    </>
  );
};

export default Demo;
