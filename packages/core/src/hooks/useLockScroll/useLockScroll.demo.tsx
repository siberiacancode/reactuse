import { useDisclosure, useLockScroll } from '@siberiacancode/reactuse';
import { XIcon } from 'lucide-react';

const Demo = () => {
  const dialog = useDisclosure();
  useLockScroll({ enabled: dialog.opened });

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <h2 className='text-foreground text-base font-semibold'>Lock the page scroll</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Open the dialog below — while it is visible, the page behind it cannot be scrolled. Close
        the dialog and scrolling becomes available again.
      </p>

      <button className='self-start' data-size='sm' type='button' onClick={dialog.open}>
        Open dialog
      </button>

      {dialog.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-150'
          onClick={dialog.close}
        >
          <div
            className='animate-in fade-in zoom-in-95 border-border bg-card flex w-full max-w-sm flex-col gap-3 rounded-xl border p-5 shadow-2xl duration-200'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='flex items-start justify-between gap-2'>
              <h3 className='text-foreground text-sm font-semibold'>Delete this project?</h3>
              <button
                aria-label='Close'
                data-size='icon'
                data-variant='ghost'
                type='button'
                onClick={dialog.close}
              >
                <XIcon className='size-3.5' />
              </button>
            </div>

            <p className='text-muted-foreground text-xs leading-relaxed'>
              This will permanently remove all data, comments, and history associated with this
              project. This action cannot be undone.
            </p>

            <div className='mt-2 flex items-center justify-end gap-2'>
              <button data-size='sm' data-variant='outline' type='button' onClick={dialog.close}>
                Cancel
              </button>
              <button
                data-size='sm'
                data-variant='destructive'
                type='button'
                onClick={dialog.close}
              >
                Delete project
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
