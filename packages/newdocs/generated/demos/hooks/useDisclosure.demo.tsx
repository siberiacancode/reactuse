'use client';

import { useClickOutside, useDisclosure } from '@siberiacancode/reactuse';
import {
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
  XIcon
} from 'lucide-react';

const Demo = () => {
  const confirm = useDisclosure();
  const menu = useDisclosure();
  const menuRef = useClickOutside<HTMLDivElement>(() => menu.close());

  return (
    <section className='flex justify-center p-4'>
      <div className='border-border bg-card relative flex w-full max-w-md flex-col gap-4 rounded-xl border p-5 shadow-sm'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='border-border bg-muted flex size-10 items-center justify-center rounded-lg border'>
              <img alt='reactuse' className='size-5' src='/new/logo.svg' />
            </div>
            <div className='flex flex-col'>
              <h3 className='text-foreground text-base leading-tight font-semibold'>reactuse</h3>
              <span className='text-muted-foreground font-mono text-xs'>
                @siberiacancode/reactuse
              </span>
            </div>
          </div>

          <div className='relative'>
            <button
              aria-label='Project options'
              data-variant='ghost'
              type='button'
              onClick={() => menu.toggle()}
            >
              <MoreHorizontalIcon className='size-4' />
            </button>

            {menu.opened && (
              <div
                ref={menuRef}
                className='absolute top-full right-0 mt-2 w-56'
                data-slot='dropdown-menu-content'
              >
                <div data-slot='dropdown-menu-item' onClick={menu.close}>
                  <PencilIcon />
                  Edit
                </div>
                <div data-slot='dropdown-menu-item' onClick={menu.close}>
                  <CopyIcon />
                  Duplicate
                  <span data-slot='dropdown-menu-shortcut'>⌘D</span>
                </div>
                <div data-slot='dropdown-menu-item' onClick={menu.close}>
                  <Share2Icon />
                  Share
                </div>
                <div data-slot='dropdown-menu-separator' />
                <div
                  data-slot='dropdown-menu-item'
                  data-variant='destructive'
                  onClick={() => {
                    menu.close();
                    confirm.open();
                  }}
                >
                  <Trash2Icon />
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>

        <p className='text-foreground text-sm leading-relaxed'>
          Collection of essential React hooks for everyday development. Type-safe, tree-shakeable,
          and built with a focus on developer experience.
        </p>

        <div className='flex flex-wrap items-center gap-2'>
          <span className='border-border bg-card text-foreground flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium'>
            <span className='size-1.5 rounded-full bg-green-500' />
            Active
          </span>
          <span className='border-border bg-card text-foreground rounded-full border px-2.5 py-0.5 text-xs font-medium'>
            React 19
          </span>
          <span className='border-border bg-card text-foreground rounded-full border px-2.5 py-0.5 text-xs font-medium'>
            TypeScript
          </span>
          <span className='border-border bg-card text-foreground rounded-full border px-2.5 py-0.5 text-xs font-medium'>
            Vite
          </span>
        </div>

        <div className='border-border grid grid-cols-3 gap-2 border-t pt-3'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
              Commits
            </span>
            <span className='text-foreground text-lg font-semibold tabular-nums'>248</span>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
              Branches
            </span>
            <span className='text-foreground text-lg font-semibold tabular-nums'>7</span>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
              Issues
            </span>
            <span className='text-foreground text-lg font-semibold tabular-nums'>12</span>
          </div>
        </div>
      </div>

      {confirm.opened && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={confirm.close}
        >
          <div
            className='border-border bg-card relative flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-lg'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label='Close'
              className='absolute top-3 right-3'
              data-variant='ghost'
              type='button'
              onClick={confirm.close}
            >
              <XIcon className='size-4' />
            </button>

            <div className='flex flex-col gap-1'>
              <h2 className='text-foreground text-base font-semibold'>Delete project</h2>
              <p className='text-muted-foreground text-sm'>
                Are you sure you want to delete{' '}
                <span className='text-foreground font-medium'>reactuse</span>? This action cannot be
                undone.
              </p>
            </div>

            <div className='flex justify-end gap-2'>
              <button data-variant='ghost' type='button' onClick={confirm.close}>
                Cancel
              </button>
              <button data-variant='destructive' type='button'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
