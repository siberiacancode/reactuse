'use client'

import { useDisplayMedia } from '@siberiacancode/reactuse';
import { MicIcon, MicOffIcon, MonitorUpIcon, PhoneOffIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const PARTICIPANTS = [
  {
    id: 1,
    name: 'siberiacancode',
    initials: 'SC'
  },
  {
    id: 2,
    name: 'charmander',
    avatar:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
  }
];

const Demo = () => {
  const displayMedia = useDisplayMedia();
  const [muted, setMuted] = useState(false);

  if (!displayMedia.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-[500px] flex-col gap-3 p-4'>
      <div className='border-border flex flex-col overflow-hidden rounded-xl border bg-neutral-950'>
        <div className='relative flex aspect-[24/9] items-center justify-center bg-black'>
          <video
            autoPlay
            muted
            playsInline
            ref={displayMedia.ref}
            className={cn('size-full object-contain p-2', !displayMedia.sharing && 'hidden')}
          />

          {!displayMedia.sharing && (
            <div className='grid size-full grid-cols-2 gap-2 p-2'>
              {PARTICIPANTS.map((participant) => (
                <div
                  key={participant.id}
                  className='flex flex-col items-center justify-center gap-2 rounded-lg bg-neutral-900 p-3'
                >
                  {participant.initials && (
                    <div
                      className='size-12 bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'
                      data-slot='avatar'
                    >
                      <span data-slot='avatar-fallback'>{participant.initials}</span>
                    </div>
                  )}
                  {participant.avatar && (
                    <div className='size-12 bg-neutral-800' data-slot='avatar'>
                      <img
                        alt={participant.name}
                        className='object-cover'
                        data-slot='avatar-image'
                        src={participant.avatar}
                      />
                    </div>
                  )}
                  <span className='text-xs font-medium text-white'>{participant.name}</span>
                </div>
              ))}
            </div>
          )}

          {displayMedia.sharing && (
            <div className='absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-neutral-900 shadow-sm'>
              SHARING
            </div>
          )}
        </div>

        <div className='flex items-center justify-between gap-2 p-3'>
          <button
            aria-label={muted ? 'Unmute' : 'Mute'}
            data-variant={muted ? 'destructive' : 'secondary'}
            type='button'
            onClick={() => setMuted((value) => !value)}
          >
            {muted ? <MicOffIcon className='size-4' /> : <MicIcon className='size-4' />}
          </button>

          <div className='flex items-center gap-2'>
            <button
              aria-label={displayMedia.sharing ? 'Stop sharing' : 'Share screen'}
              data-variant={displayMedia.sharing ? 'destructive' : 'secondary'}
              type='button'
              onClick={displayMedia.sharing ? displayMedia.stop : displayMedia.start}
            >
              <MonitorUpIcon className='size-4' />
            </button>

            <button data-variant='destructive' type='button'>
              <PhoneOffIcon className='size-4' />
              End
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
