import { useDisplayMedia } from '@siberiacancode/reactuse';

const Demo = () => {
  const { sharing, supported, start, stop, ref } = useDisplayMedia();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-center gap-4'>
        <button disabled={!supported} type='button' onClick={sharing ? stop : start}>
          {sharing ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>

      <video muted playsInline ref={ref} className='w-full max-w-2xl rounded border' autoPlay />
    </div>
  );
};

export default Demo;
