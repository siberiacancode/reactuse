import { useClickOutside, useDisclosure, usePictureInPicture } from '@siberiacancode/reactuse';
import { FlagIcon, MoreHorizontalIcon, PictureInPicture2Icon, Share2Icon } from 'lucide-react';

const Demo = () => {
  const pictureInPicture = usePictureInPicture();
  const menu = useDisclosure();
  const menuRef = useClickOutside<HTMLDivElement>(() => menu.close());

  const onPictureInPicture = () => {
    menu.close();
    void pictureInPicture.toggle();
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='border-border relative overflow-hidden rounded-xl border'>
        <video
          controls
          ref={pictureInPicture.ref}
          className='aspect-video w-full'
          src='/new/videos/waves.mp4'
        />
      </div>

      <h3 className='text-foreground text-sm leading-snug font-semibold'>
        Building open-source React hooks - the reactuse demo reel
      </h3>

      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-xs font-semibold text-white'>
            SC
          </div>
          <div className='flex flex-col'>
            <span className='text-foreground text-sm font-medium'>siberiacancode</span>
            <span className='text-muted-foreground text-xs'>12.4K subscribers</span>
          </div>
        </div>

        <div ref={menuRef} className='relative'>
          <button
            aria-label='More'
            className='rounded-full!'
            data-size='icon-sm'
            data-variant='secondary'
            type='button'
            onClick={() => menu.toggle()}
          >
            <MoreHorizontalIcon className='size-4' />
          </button>

          {menu.opened && (
            <div
              className='absolute right-0 bottom-full mb-1.5 w-44'
              data-slot='dropdown-menu-content'
            >
              {pictureInPicture.supported && (
                <div data-slot='dropdown-menu-item' onClick={onPictureInPicture}>
                  <PictureInPicture2Icon />
                  {pictureInPicture.opened ? 'Exit Picture-in-Picture' : 'Picture-in-Picture'}
                </div>
              )}
              <div data-slot='dropdown-menu-item' onClick={menu.close}>
                <Share2Icon />
                Share
              </div>
              <div data-slot='dropdown-menu-item' data-variant='destructive' onClick={menu.close}>
                <FlagIcon />
                Report
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
