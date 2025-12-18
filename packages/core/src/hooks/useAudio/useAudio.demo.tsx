import { useAudio } from './useAudio';

const Demo = () => {
  const popDownAudio = useAudio('/reactuse/pop-down.mp3', {
    volume: 0.5,
    playbackRate: 2
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between rounded-md border-2 border-gray-400 p-4'>
        <div className='flex flex-col items-start gap-1'>
          <div className='flex items-center gap-2 text-xl font-medium'>
            <div
              className={`h-2 w-2 rounded-full ${
                popDownAudio.playing ? 'bg-green-300' : 'bg-red-300'
              }`}
            />
            pop-down
          </div>
          <div className='text-sm text-gray-500'>mp3</div>
        </div>

        <button
          className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          type='button'
          onClick={() => popDownAudio.play()}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default Demo;
