import { useEyeDropper } from '@siberiacancode/reactuse';

const Demo = () => {
  const eyeDropper = useEyeDropper();

  return (
    <>
      <p>
        supported: <code>{String(eyeDropper.supported)}</code>
      </p>
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
