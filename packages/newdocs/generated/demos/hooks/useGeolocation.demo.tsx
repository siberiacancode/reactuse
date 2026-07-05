'use client'

import { useCopy, useGeolocation } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon, MapPinIcon } from 'lucide-react';

const FALLBACK_COORDINATES = { latitude: 56.47414476814171, longitude: 84.95003125501695 };

const getMapEmbedUrl = (latitude: number, longitude: number) =>
  `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

const formatCoordinates = (latitude: number, longitude: number) =>
  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

const Demo = () => {
  const geolocation = useGeolocation();
  const { copy, copied } = useCopy();

  const hasLocation =
    !geolocation.value.loading &&
    !geolocation.value.error &&
    geolocation.value.latitude !== null &&
    geolocation.value.longitude !== null;

  const latitude = hasLocation ? geolocation.value.latitude! : FALLBACK_COORDINATES.latitude;
  const longitude = hasLocation ? geolocation.value.longitude! : FALLBACK_COORDINATES.longitude;

  return (
    <section className='flex w-full max-w-xl flex-col p-4'>
      <div className='bg-card relative h-[360px] overflow-hidden rounded-2xl shadow-sm'>
        <iframe
          allow='geolocation'
          className='size-full border-0'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          src={getMapEmbedUrl(latitude, longitude)}
          title='Map'
        />

        <div className='absolute top-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 py-1.5 pr-1.5 pl-3 shadow-lg backdrop-blur-md'>
          {hasLocation && (
            <>
              <span className='font-mono text-xs font-semibold text-white tabular-nums'>
                {formatCoordinates(latitude, longitude)}
              </span>
              <button
                aria-label='Copy coordinates'
                data-size='icon-sm'
                data-variant='unstyled'
                type='button'
                onClick={() => copy(formatCoordinates(latitude, longitude))}
              >
                {copied ? (
                  <CheckIcon className='size-3.5 text-green-400' />
                ) : (
                  <CopyIcon className='size-3.5 text-white' />
                )}
              </button>
            </>
          )}

          {!hasLocation && (
            <>
              <MapPinIcon className='size-3.5 text-white/70' />
              <span className='pr-2 text-[10px] tracking-[0.15em] text-white/90 uppercase'>
                {geolocation.value.error ? 'Location unavailable' : 'Locating...'}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
