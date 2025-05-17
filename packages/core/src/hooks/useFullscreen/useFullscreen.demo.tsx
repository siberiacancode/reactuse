import { useFullscreen } from '@siberiacancode/reactuse';

const Demo = () => {
  const fullscreen = useFullscreen<HTMLVideoElement>();

  return (
    <div>
      <div className='text-center'>
        <div className='flex py-4'>
          <video
            muted
            ref={fullscreen.ref}
            className='m-auto rounded'
            src='https://vjs.zencdn.net/v/oceans.mp4'
            width='600'
            controls
          />
        </div>
        <button type='button' onClick={fullscreen.toggle}>
          Go Fullscreen
        </button>
      </div>
    </div>
  );
};

export default Demo;
