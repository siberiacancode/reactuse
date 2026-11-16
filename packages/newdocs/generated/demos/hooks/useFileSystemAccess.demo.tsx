'use client'

import type { MouseEvent } from 'react';

import {
  useBoolean,
  useClickOutside,
  useField,
  useFileSystemAccess
} from '@siberiacancode/reactuse';
import { FileTextIcon, ReplaceIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const fileSystemAccess = useFileSystemAccess({
    dataType: 'Text',
    types: [
      {
        description: 'Text',
        accept: { 'text/plain': ['.txt'] }
      },
      {
        description: 'Markdown',
        accept: { 'text/markdown': ['.md', '.markdown'] }
      }
    ]
  });

  const findField = useField('');
  const replaceField = useField('');
  const [findOpen, toggleFindOpen] = useBoolean(false);
  const [content, setContent] = useState('');

  const findPanelRef = useClickOutside<HTMLDivElement>(() => {
    if (findOpen) toggleFindOpen(false);
  });

  if (!fileSystemAccess.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const find = findField.watch();
  const replace = replaceField.watch();
  const matches = find ? content.split(find).length - 1 : 0;
  const dirty = !!fileSystemAccess.file && content !== fileSystemAccess.data;

  const onSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await fileSystemAccess.save();
    setContent(fileSystemAccess.data ?? '');
  };

  const onOpen = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = await fileSystemAccess.open();
    setContent(data);
  };

  const onReplaceAll = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!find || !matches) return;
    const updated = content.split(find).join(replace);
    fileSystemAccess.set(updated);
    findField.setValue('');
    replaceField.setValue('');
  };

  return (
    <section className='flex w-full max-w-2xl flex-col p-4'>
      <div className='border-border bg-card relative flex h-[280px] flex-col overflow-hidden rounded-xl border shadow-sm'>
        {!fileSystemAccess.file && (
          <div className='flex size-full flex-col items-center justify-center gap-3 p-6'>
            <div className='bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full'>
              <FileTextIcon className='size-6' />
            </div>
            <div className='flex flex-col items-center gap-1 text-center'>
              <p className='text-foreground text-sm font-medium'>No file opened</p>
              <p className='text-muted-foreground text-xs'>
                Open a .txt or .md file to start editing
              </p>
            </div>
            <button data-size='sm' type='button' onClick={onOpen}>
              Open file
            </button>
          </div>
        )}

        {fileSystemAccess.file && (
          <>
            <div className='border-border bg-muted/40 flex shrink-0 items-center gap-2 border-b px-3 py-2'>
              <div className='bg-card flex size-6 shrink-0 items-center justify-center'>
                <FileTextIcon className='text-muted-foreground size-3' />
              </div>
              <span className='text-foreground min-w-0 flex-1 truncate text-xs font-medium'>
                {fileSystemAccess.name}
              </span>

              <div className='flex items-center gap-1'>
                <button
                  aria-label='Find and replace'
                  data-size='icon-sm'
                  data-variant='ghost'
                  type='button'
                  onClick={() => toggleFindOpen()}
                >
                  <ReplaceIcon className='size-3.5' />
                </button>
                <button data-size='sm' disabled={!dirty} type='button' onClick={onSave}>
                  Save
                </button>
              </div>
            </div>

            <textarea
              className='no-scrollbar text-foreground flex-1 resize-none rounded-none! border-none! bg-transparent p-3 font-mono text-xs shadow-none! ring-0! outline-none!'
              value={fileSystemAccess.data}
              onChange={(event) => fileSystemAccess.set(event.target.value)}
            />

            {findOpen && (
              <div
                ref={findPanelRef}
                className='border-border bg-card absolute top-12 right-3 z-20 flex w-[240px] flex-col gap-3 rounded-xl border p-3 shadow-lg'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-foreground text-[11px] font-medium'>Find and replace</span>
                  <button
                    aria-label='Close'
                    data-size='icon'
                    data-variant='ghost'
                    type='button'
                    onClick={() => toggleFindOpen()}
                  >
                    <XIcon className='size-3' />
                  </button>
                </div>

                <div className='flex flex-col gap-2'>
                  <input
                    autoFocus
                    className='border-border bg-background text-foreground rounded-md border px-2.5 py-1.5 text-[11px] outline-none'
                    placeholder='Find'
                    {...findField.register()}
                  />
                  <div className='relative'>
                    <input
                      className='border-border bg-background text-foreground w-full rounded-md border px-2.5 py-1.5 pr-8 text-[11px] outline-none'
                      placeholder='Replace with'
                      {...replaceField.register()}
                    />
                    <button
                      aria-label='Replace all'
                      className='absolute top-1/2 right-1 -translate-y-1/2'
                      data-size='icon-xs'
                      data-variant='ghost'
                      disabled={!find || !matches}
                      type='button'
                      onClick={onReplaceAll}
                    >
                      <ReplaceIcon className='size-3' />
                    </button>
                  </div>
                </div>

                {!!find && (
                  <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                    {matches} {matches === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Demo;
