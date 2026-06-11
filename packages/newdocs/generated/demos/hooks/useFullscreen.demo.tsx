'use client'

import { useFullscreen, useMediaControls } from '@siberiacancode/reactuse';
import { MaximizeIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';

const VOLUME = 0.1;

const Demo = () => {
  const fullscreen = useFullscreen<HTMLDivElement>();
  const media = useMediaControls<HTMLVideoElement>('/new/videos/waves.mp4');

  const onMute = () => {
    if (media.muted) {
      media.unmute();
      media.changeVolume(VOLUME);
      return;
    }
    media.mute();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        ref={fullscreen.ref}
        className='border-border group relative overflow-hidden rounded-xl border'
      >
        <video
          loop
          muted
          playsInline
          ref={media.ref}
          className='aspect-video w-full bg-black object-cover'
          preload='none'
        />

        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

        <div className='absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='flex items-center gap-1'>
            <button
              aria-label={media.playing ? 'Pause' : 'Play'}
              className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
              data-size='icon-sm'
              data-variant='unstyled'
              type='button'
              onClick={() => media.toggle()}
            >
              {media.playing && <PauseIcon className='size-3.5' />}
              {!media.playing && <PlayIcon className='size-3.5' />}
            </button>
            <button
              aria-label={media.muted ? 'Unmute' : 'Mute'}
              className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
              data-size='icon-sm'
              data-variant='unstyled'
              type='button'
              onClick={onMute}
            >
              {media.muted && <VolumeXIcon className='size-3.5' />}
              {!media.muted && <Volume2Icon className='size-3.5' />}
            </button>
          </div>

          <button
            aria-label='Fullscreen'
            className='bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
            data-size='icon-sm'
            data-variant='unstyled'
            type='button'
            onClick={fullscreen.toggle}
          >
            <MaximizeIcon className='size-3.5' />
          </button>
        </div>
      </div>

      <div className='mt-3 flex flex-col gap-0.5'>
        <h2 className='text-foreground text-sm font-semibold'>Ocean waves at sunset 🌊</h2>
        <p className='text-muted-foreground text-xs'>
          A calm, slow-motion clip of waves rolling in over the open sea.
        </p>
      </div>
    </section>
  );
};

export default Demo;
