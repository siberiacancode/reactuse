'use client';

import { useLastChanged } from '@siberiacancode/reactuse';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const Demo = () => {
  const [title, setTitle] = useState('Quarterly product roadmap');
  const lastChanged = useLastChanged(title);

  return (
    <section className='flex w-full max-w-md flex-col gap-2 p-4'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-[10px] tracking-wider uppercase'>
        <FileTextIcon className='size-3' />
        Project name
      </div>

      <div className='flex flex-col gap-1'>
        <h1
          contentEditable
          suppressContentEditableWarning
          className='text-foreground hover:bg-muted/30 focus:bg-muted/20 -mx-1 cursor-text rounded-md px-1 pb-1 text-2xl font-bold tracking-tight transition-colors outline-none'
          onBlur={(event) => setTitle(event.currentTarget.textContent ?? '')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
        >
          {title}
        </h1>

        <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
          {lastChanged ? `Edited at ${formatTime(lastChanged)}` : 'No changes yet'}
        </span>
      </div>
    </section>
  );
};

export default Demo;
