'use client'

import { useClipboard, useDisclosure } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

const SHARE_URL = 'https://reactuse.org';

const Demo = () => {
  const clipboard = useClipboard();
  const toast = useDisclosure();

  const onShare = () => {
    if (toast.opened) return;
    clipboard.copy(SHARE_URL);
    toast.open();
    setTimeout(toast.close, 1500);
  };

  return (
    <section className='flex max-w-sm flex-col gap-5'>
      <div className='flex flex-col items-center gap-2'>
        <h3>Share with friends</h3>
        <p className='text-muted-foreground text-center text-sm'>
          Spread the word about <b>reactuse</b>. Click the button below to copy the link to your
          clipboard and share it with anyone.
        </p>
      </div>

      <div className='relative mt-2 flex items-center gap-2'>
        <input readOnly className='text-md! h-12! rounded-full! px-3!' value={SHARE_URL} />
        <button className='absolute top-2 right-2 h-8!' type='button' onClick={onShare}>
          <CopyIcon className='size-4' /> Share
        </button>
      </div>

      <p className='text-muted-foreground text-center text-xs'>
        Star us on{' '}
        <a
          className='underline'
          href='https://github.com/siberiacancode/reactuse'
          rel='noreferrer'
          target='_blank'
        >
          GitHub
        </a>
      </p>

      {toast.opened &&
        createPortal(
          <div className='animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 shadow-xl duration-300 sm:right-6 sm:left-auto sm:w-auto sm:min-w-72 dark:border-white/10 dark:bg-neutral-900 dark:text-white'>
            <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-900 dark:bg-white'>
              <CheckIcon className='size-3.5 text-white dark:text-gray-900' />
            </div>
            Copied to clipboard!
          </div>,
          document.body
        )}
    </section>
  );
};

export default Demo;
