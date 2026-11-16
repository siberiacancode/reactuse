'use client'

import { useDidUpdate } from '@siberiacancode/reactuse';
import { CheckIcon, LoaderIcon } from 'lucide-react';
import { useState } from 'react';

type SaveStatus = 'idle' | 'saved' | 'saving';

const Demo = () => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');

  useDidUpdate(() => {
    setStatus('saving');

    const timeout = setTimeout(() => {
      setStatus('saved');
    }, 600);

    return () => clearTimeout(timeout);
  }, [content]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <section className='flex w-full max-w-md min-w-0 flex-col gap-2'>
      <textarea
        className='border-border bg-card text-foreground placeholder:text-muted-foreground w-full resize-none overflow-hidden rounded-lg border p-3 text-sm outline-none'
        placeholder='Start typing...'
        rows={10}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <div className='flex flex-wrap items-center justify-between gap-2'>
        {status === 'idle' && <span className='text-muted-foreground text-xs'>Not saved yet</span>}

        {status === 'saving' && (
          <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            <LoaderIcon className='size-3 animate-spin' />
            Saving...
          </span>
        )}

        {status === 'saved' && (
          <span className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500'>
            <CheckIcon className='size-3' />
            Saved
          </span>
        )}

        <span className='text-muted-foreground text-xs tabular-nums'>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {content.length} chars
        </span>
      </div>
    </section>
  );
};

export default Demo;
