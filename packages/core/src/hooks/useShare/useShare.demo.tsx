import { useShare } from '@siberiacancode/reactuse';

const Demo = () => {
  const { share, supported } = useShare();

  return (
    <>
      <p>
        supported: <code>{String(supported)}</code>
      </p>

      <button
        type='button'
        onClick={() =>
          share({
            title: '@siberiacancode/reactuse',
            text: '@siberiacancode/reactuse is awesome',
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
