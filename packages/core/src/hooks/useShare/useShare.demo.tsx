import { useShare } from '@siberiacancode/reactuse';

const Demo = () => {
  const { share, supported } = useShare();

  if (!supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <>
      <p>Click the button to share the content</p>
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
