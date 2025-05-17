import { useEyeDropper } from '@siberiacancode/reactuse';

const Demo = () => {
  const eyeDropper = useEyeDropper();

  if (!eyeDropper.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper'
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
        value:{' '}
        <span style={{ color: eyeDropper.value }}>
          {eyeDropper.value ? eyeDropper.value : 'choose color'}
        </span>
      </p>
      <button disabled={!eyeDropper.supported} type='button' onClick={() => eyeDropper.open()}>
        Open eye dropper
      </button>
    </>
  );
};

export default Demo;
