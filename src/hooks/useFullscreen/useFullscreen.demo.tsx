import { useFullscreen } from './useFullscreen';

const Demo = () => {
  const { ref, value, enter, exit, toggle } = useFullscreen<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div>
        <p>{value ? 'fullscreen' : 'not fullscreen'}</p>
        <button type='button' onClick={enter}>
          Enter
        </button>
        <button type='button' onClick={exit}>
          Exit
        </button>
        <button type='button' onClick={toggle}>
          Toggle
        </button>
      </div>
    </div>
  );
};

export default Demo;
