import { useShare } from './useShare';

const Demo = () => {
  const { share, isSupported, isReady, isShared } = useShare();

  return (
    <>
      <p>
        Is supported: <code>{String(isSupported)}</code>
      </p>
      <p>
        Is ready: <code>{String(isReady)}</code>
      </p>
      <p>
        Is shared: <code>{String(isShared)}</code>
      </p>
      <button
        type='button'
        onClick={() =>
          share({
            title: 'ReactUse',
            text: 'ReactUse is awesome',
            url: 'https://siberiacancode.github.io/reactuse'
          })
        }
      >
        Share
      </button>
    </>
  );
};

export default Demo;
