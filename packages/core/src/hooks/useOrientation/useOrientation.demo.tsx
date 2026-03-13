import { useOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const orientation = useOrientation();

  if (!orientation.supported)
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

      <div className='flex flex-col gap-2'>
        <div>
          type: <code>{orientation.value.orientationType}</code>
        </div>
        <div>
          angle: <code>{orientation.value.angle}</code>
        </div>
      </div>
    </>
  );
};

export default Demo;
