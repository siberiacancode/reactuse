import { usePictureInPicture } from '@siberiacancode/reactuse';

const Demo = () => {
  const pictureInPicture = usePictureInPicture();

  if (!pictureInPicture.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div>
      <div className='space-y-4'>
        <div>
          <video
            ref={pictureInPicture.ref}
            className='w-full max-w-[600px] rounded-lg'
            src='https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm'
            controls
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <button onClick={pictureInPicture.toggle}>
              {pictureInPicture.open ? 'Close' : 'Open'} Picture-in-Picture
            </button>
          </div>

          <p>
            Status: <code>{pictureInPicture.open ? 'active' : 'inactive'}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
