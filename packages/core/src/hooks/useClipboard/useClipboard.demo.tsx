import { useClipboard } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

const SHARE_URL = 'https://reactuse.org';

const Demo = () => {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);

  const onShare = () => {
    if (copied) return;
    clipboard.copy(SHARE_URL);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <section className='flex max-w-sm flex-col gap-5'>
      <div className='flex flex-col items-center gap-2'>
        <h3>Share with friends</h3>
        <p className='text-muted-foreground text-center text-sm'>
          Spread the word about <code>reactuse</code>. Click the button below to copy the link to
          your clipboard and share it with anyone.
        </p>
      </div>

      <div className='relative mt-2 flex items-center gap-2'>
        <input readOnly className='text-md! h-12! rounded-full! px-3!' value={SHARE_URL} />

        <button className='absolute top-2 right-2 h-8!' type='button' onClick={onShare}>
          {copied ? (
            <>
              <CheckIcon className='size-4' /> Copied
            </>
          ) : (
            <>
              <CopyIcon className='size-4' /> Share
            </>
          )}
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
    </section>
  );
};

export default Demo;
