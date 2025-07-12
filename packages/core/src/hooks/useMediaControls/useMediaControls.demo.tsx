import { useMediaControls } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const Demo = () => {
  const [scrubbing, setScrubbing] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const videoMediaControls = useMediaControls<HTMLVideoElement>({
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm',
    type: 'video/webm'
  });

  const onMouseMove = (event: React.MouseEvent) => {
    if (!scrubberRef.current || !scrubbing) return;

    const rect = scrubberRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    const progress = Math.max(0, Math.min(1, x / width));
    const newValue = progress * 100;

    setProgress(newValue);

    if (scrubbing) videoMediaControls.seek((newValue / 100) * videoMediaControls.duration);
  };

  return (
    <div className='space-y-4'>
      <video
        ref={videoMediaControls.ref}
        className='w-full max-w-[600px] rounded-lg'
        poster='https://cdn.bitmovin.com/content/assets/sintel/poster.png'
      />

      <div
        ref={scrubberRef}
        className='relative h-2 cursor-pointer select-none rounded bg-black bg-opacity-20'
        onMouseDown={() => setScrubbing(true)}
        onMouseMove={onMouseMove}
        onMouseUp={() => setScrubbing(false)}
      >
        <div className='relative h-full w-full overflow-hidden rounded'>
          <div
            style={{
              transform: `translateX(${
                ((videoMediaControls.buffered?.[0]?.[1] || 0) / videoMediaControls.duration) * 100 -
                100
              }%)`
            }}
            className='absolute left-0 top-0 h-full w-full rounded bg-emerald-700 opacity-30'
          />

          <div
            style={{
              transform: `translateX(${
                (videoMediaControls.buffered
                  ? videoMediaControls.currentTime / videoMediaControls.duration
                  : 0) *
                  100 -
                100
              }%)`
            }}
            className='absolute left-0 top-0 h-full w-full rounded bg-cyan-700 opacity-30'
          />
          <div
            style={{
              transform: `translateX(${progress - 100}%)`
            }}
            className='relative h-full w-full rounded bg-cyan-500'
          />
        </div>
      </div>

      <div className='flex justify-between'>
        <div>
          <button onClick={videoMediaControls.toggle}>
            {videoMediaControls.playing ? 'Pause' : 'Play'}
          </button>

          <button onClick={() => videoMediaControls.seek(videoMediaControls.currentTime + 10)}>
            +10s
          </button>
          <button onClick={() => videoMediaControls.seek(videoMediaControls.currentTime - 10)}>
            -10s
          </button>
        </div>

        <div>
          <button
            onClick={() =>
              videoMediaControls.muted ? videoMediaControls.unmute() : videoMediaControls.mute()
            }
          >
            {videoMediaControls.muted ? 'Unmute' : 'Mute'}
          </button>

          <button
            onClick={() => {
              if (videoMediaControls.playbackRate === 1) videoMediaControls.changePlaybackRate(1.5);
              if (videoMediaControls.playbackRate === 1.5) videoMediaControls.changePlaybackRate(2);
              if (videoMediaControls.playbackRate === 2) videoMediaControls.changePlaybackRate(1);
            }}
          >
            {videoMediaControls.playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
