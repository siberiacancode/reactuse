import { useProgress } from './useProgress';

const Demo = () => {
  const progress = useProgress(0, {
    speed: 250
  });

  const percent = Math.round(progress.value * 100);

  return (
    <div>
      {!!progress.active && (
        <div className='fixed top-0 left-0 z-[9999] h-1.5 w-full bg-sky-400/25'>
          <div
            className='h-full bg-sky-400 transition-[width] duration-200 ease-out'
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <div>
        <p>Click to change progress status</p>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => (progress.active ? progress.done() : progress.start())}
          >
            {progress.active ? 'Done' : 'Start'}
          </button>
          {!!progress.active && <span>{percent}%</span>}
        </div>
      </div>
    </div>
  );
};

export default Demo;
