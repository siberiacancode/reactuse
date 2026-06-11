'use client'

import type { ClipboardEvent } from 'react';

import { useMutationObserver } from '@siberiacancode/reactuse';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';

const INITIAL_TEXT =
  'reactuse is a collection of essential React hooks. Start typing here and watch the stats update as the content changes.';

const getStats = (text: string) => {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, characters, minutes };
};

const Demo = () => {
  const [stats, setStats] = useState(() => getStats(INITIAL_TEXT));

  const editor = useMutationObserver<HTMLDivElement>({
    childList: true,
    subtree: true,
    characterData: true,
    onChange: () => {
      const text = editor.ref.current?.textContent ?? '';
      setStats(getStats(text));
    }
  });

  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase'>
        <FileTextIcon className='size-3.5' />
        Draft
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        ref={editor.ref}
        className='text-foreground min-h-36 rounded-lg text-base leading-relaxed outline-none'
        onPaste={onPaste}
      >
        {INITIAL_TEXT}
      </div>

      <div className='border-border text-muted-foreground flex gap-5 border-t pt-3 text-xs'>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.words}</span> words
        </span>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.characters}</span>{' '}
          characters
        </span>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>{stats.minutes}</span> min
          read
        </span>
      </div>
    </section>
  );
};

export default Demo;
