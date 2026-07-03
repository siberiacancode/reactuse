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
      <div className='bg-card/70 flex flex-col overflow-hidden rounded-xl'>
        <div className='relative flex aspect-[24/9] items-center justify-center'>
          <video
            autoPlay
            muted
            playsInline
            ref={displayMedia.ref}
            className={cn('size-full object-contain p-2', !displayMedia.active && 'hidden')}
          />

          {!displayMedia.active && (
            <div className='grid size-full grid-cols-2 gap-2 p-2'>
              {PARTICIPANTS.map((participant) => (
                <div
                  key={participant.id}
                  className='bg-card flex flex-col items-center justify-center gap-2 rounded-lg p-3'
                >
                  {participant.initials && (
                    <div
                      className='bg-muted text-foreground size-12 text-sm font-semibold'
                      data-slot='avatar'
                    >
                      <span data-slot='avatar-fallback'>{participant.initials}</span>
                    </div>
                  )}
                  {participant.avatar && (
                    <div className='bg-muted size-12' data-slot='avatar'>
                      <img
                        alt={participant.name}
                        className='object-cover'
                        data-slot='avatar-image'
                        src={participant.avatar}
                      />
                    </div>
                  )}
                  <span className='text-foreground text-xs font-medium'>{participant.name}</span>
                </div>
              ))}
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
              aria-label={displayMedia.active ? 'Stop sharing' : 'Share screen'}
              data-variant={displayMedia.active ? 'destructive' : 'secondary'}
              type='button'
              onClick={displayMedia.active ? displayMedia.stop : displayMedia.start}
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
