import { useBoolean, useTimeout } from '@siberiacancode/reactuse';
import { Webcam } from '@webcam/react';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [ready, setReady] = useBoolean(false);
  const [snapshot, setSnapshot] = useState<string>();

  useTimeout(() => setReady(true), 2000);

  const onDownload = () => {
    if (!snapshot) return;
    const link = document.createElement('a');
    link.href = snapshot;
    link.download = `qr-snapshot-${Date.now()}.png`;
    link.click();
  };

  return (
    <section className='flex justify-center'>
      <div className='relative flex h-[520px] w-80 flex-col overflow-hidden rounded-4xl border bg-black'>
        <div className='bg-background absolute top-3 left-1/2 z-30 h-6 w-24 -translate-x-1/2 rounded-full' />

        <Webcam
          mainCamera
          muted
          className='absolute inset-0 size-full object-cover'
          onError={(error) => console.error(error)}
        >
          {({ getSnapshot }) => (
            <>
              <div className='pointer-events-none absolute inset-0 z-0 bg-black/25' />

              <div className='absolute top-1/2 left-1/2 z-10 size-48 -translate-x-1/2 -translate-y-1/2'>
                <span className='absolute -top-px -left-px size-8 rounded-tl-xl border-t-3 border-l-3 border-white' />
                <span className='absolute -top-px -right-px size-8 rounded-tr-xl border-t-3 border-r-3 border-white' />
                <span className='absolute -bottom-px -left-px size-8 rounded-bl-xl border-b-3 border-l-3 border-white' />
                <span className='absolute -right-px -bottom-px size-8 rounded-br-xl border-r-3 border-b-3 border-white' />
              </div>

              <div className='absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-1 px-6 pt-16 pb-6 text-center'>
                <p className='text-sm font-medium text-white'>Point at a QR code</p>
                <p className='text-[11px] text-white/60'>
                  Hold the camera steady so the code fits the frame
                </p>
              </div>

              {ready && (
                <div className='absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-6 pb-10'>
                  <p className='text-[11px] text-white/70'>Tap to take a photo</p>
                  <button
                    aria-label='Capture'
                    className='size-12! rounded-full!'
                    type='button'
                    onClick={() => setSnapshot(getSnapshot({ quality: 0.9 }))}
                  />
                </div>
              )}

              {snapshot && (
                <div className='absolute inset-0 z-20'>
                  <img alt='Snapshot' className='size-full object-cover' src={snapshot} />

                  <button
                    aria-label='Close preview'
                    className='absolute top-4 right-4'
                    data-size='icon'
                    data-slot='button'
                    data-variant='ghost'
                    type='button'
                    onClick={() => setSnapshot(undefined)}
                  >
                    <XIcon />
                  </button>

                  <div className='absolute inset-x-0 bottom-0 flex justify-center px-6 pb-10'>
                    <button data-slot='button' type='button' onClick={onDownload}>
                      Download
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Webcam>
      </div>
    </section>
  );
};

export default Demo;
