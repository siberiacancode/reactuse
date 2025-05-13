import { useScreenOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const screenOrientation = useScreenOrientation();

  if (!screenOrientation.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

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
