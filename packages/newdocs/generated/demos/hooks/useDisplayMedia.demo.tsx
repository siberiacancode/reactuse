'use client'

import { useDisplayMedia } from '@siberiacancode/reactuse';
import { MonitorUpIcon, PhoneOffIcon } from 'lucide-react';

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

  if (!displayMedia.supported) {
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
  }

  return (
    <section className='flex w-[500px] flex-col gap-3 p-4'>
      <div className='border-border flex flex-col overflow-hidden rounded-xl border bg-neutral-950'>
        <div className='flex items-center justify-between px-3 py-2'>
          <div className='flex items-center gap-2 text-xs font-medium text-white'>
            <span className='size-1.5 animate-pulse rounded-full bg-red-500' />
            14:23
          </div>
          {displayMedia.sharing && (
            <div className='flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold text-white'>
              <span className='size-1 animate-pulse rounded-full bg-white' />
              SHARING
            </div>
          )}
        </div>

        <div className='flex aspect-[24/9] items-center justify-center bg-black'>
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
                    <div className='flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
                      {participant.initials}
                    </div>
                  )}
                  {participant.avatar && (
                    <div className='flex size-12 items-center justify-center overflow-hidden rounded-full bg-neutral-800'>
                      <img
                        alt={participant.name}
                        className='size-full object-cover'
                        src={participant.avatar}
                      />
                    </div>
                  )}
                  <span className='text-xs font-medium text-white'>{participant.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center justify-center gap-2 p-3'>
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
    </section>
  );
};

export default Demo;
