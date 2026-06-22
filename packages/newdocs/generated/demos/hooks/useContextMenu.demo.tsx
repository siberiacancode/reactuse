'use client'

import { useClickOutside, useContextMenu } from '@siberiacancode/reactuse';
import {
  BookmarkIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  SendIcon,
  Share2Icon,
  Trash2Icon
} from 'lucide-react';

const Demo = () => {
  const contextMenu = useContextMenu<HTMLDivElement>();
  const menuRef = useClickOutside<HTMLDivElement>(() => contextMenu.close());

  return (
    <section className='flex flex-col items-center p-4'>
      <div
        ref={contextMenu.ref}
        className='bg-card w-full max-w-sm cursor-context-menu overflow-hidden rounded-2xl select-none'
      >
        <div className='flex items-center gap-3 px-4 py-3'>
          <div data-size='lg' data-slot='avatar'>
            <span data-slot='avatar-fallback'>TK</span>
          </div>
          <div className='flex flex-1 flex-col leading-tight'>
            <span className='text-foreground text-sm font-semibold'>reacuse</span>
            <span className='text-muted-foreground flex items-center gap-1 text-xs'>
              <MapPinIcon className='size-3' />
              Tokyo, Japan
            </span>
          </div>
        </div>

        <div className='relative aspect-square'>
          <img alt='Tokyo' className='size-full object-cover' src='/images/tokyo.png' />
        </div>

        <div className='flex items-center gap-4 px-4 pt-3'>
          <HeartIcon className='size-6' />
          <MessageCircleIcon className='size-6' />
          <SendIcon className='size-6' />
          <BookmarkIcon className='ml-auto size-6' />
        </div>

        <div className='flex flex-col gap-1 px-4 py-2'>
          <span className='text-foreground text-sm font-semibold'>284,910 likes</span>
          <p className='text-foreground text-sm'>
            <span className='font-semibold'>reacuse</span> Neon nights in Shibuya 🌃 Currently 18°C
            and clear.
          </p>
          <span className='text-muted-foreground text-xs'>
            9.7M residents · View all 1,204 comments
          </span>
        </div>
      </div>

      {contextMenu.opened && contextMenu.position && (
        <div
          ref={menuRef}
          className='fixed z-50 w-48'
          data-slot='dropdown-menu-content'
          style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
        >
          <div data-slot='dropdown-menu-item'>
            <HeartIcon />
            Like post
          </div>
          <div data-slot='dropdown-menu-item'>
            <BookmarkIcon />
            Save
          </div>
          <div data-slot='dropdown-menu-item'>
            <Share2Icon />
            Share
            <span data-slot='dropdown-menu-shortcut'>⌘S</span>
          </div>
          <div data-slot='dropdown-menu-separator' />
          <div data-slot='dropdown-menu-item' data-variant='destructive'>
            <Trash2Icon />
            Remove
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
