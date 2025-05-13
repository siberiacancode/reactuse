import { useDevicePixelRatio } from '@siberiacancode/reactuse';

const Demo = () => {
  const { supported, ratio } = useDevicePixelRatio();

  if (!supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <p>
      Device pixel ratio (try to zoom page in and out): <code>{ratio}</code>
    </p>
  );
};

export default Demo;
