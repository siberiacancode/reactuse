import { useFullscreen } from './useFullscreen';

const Demo = () => {
  const fullscreen = useFullscreen<HTMLDivElement>();

  return (
    <div ref={fullscreen.ref}>
      <div>
        <p>{fullscreen.value ? 'fullscreen' : 'not fullscreen'}</p>
        <button type='button' onClick={fullscreen.enter}>
          Enter
        </button>
        <button type='button' onClick={fullscreen.exit}>
          Exit
        </button>
        <button type='button' onClick={fullscreen.toggle}>
          Toggle
        </button>
      </div>
    </div>
  );
};

export default Demo;
