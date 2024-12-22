import { useVibrate } from './useVibrate';

const Demo = () => {
  const { isSupported, isVibrating, vibrate, stop } = useVibrate({
    pattern: [300, 100, 200, 100, 1000, 300]
  });

  return (
    <div>
      <button type='button' disabled={!isSupported || isVibrating} onClick={() => vibrate()}>
        {isSupported ? 'Vibrate' : 'Web vibrate is not supported in your browser'}
      </button>
      <button type='button' disabled={!isSupported} onClick={() => stop()}>
        Stop
      </button>
    </div>
  );
};

export default Demo;
