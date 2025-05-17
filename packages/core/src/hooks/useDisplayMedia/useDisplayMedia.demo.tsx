import { useDisplayMedia } from '@siberiacancode/reactuse';

const Demo = () => {
  const displayMedia = useDisplayMedia();

  if (!displayMedia.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-center gap-4'>
        <button
          type='button'
          onClick={displayMedia.sharing ? displayMedia.stop : displayMedia.start}
        >
          {displayMedia.sharing ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>

      <video
        muted
        playsInline
        ref={displayMedia.ref}
        className='w-full max-w-2xl rounded border'
        autoPlay
      />
    </div>
  );
};

export default Demo;
