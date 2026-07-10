import { useNotification } from '@siberiacancode/reactuse';
import { XIcon } from 'lucide-react';

const PERMISSION_LABELS: Record<NotificationPermission, string> = {
  default: 'Not requested',
  denied: 'Blocked',
  granted: 'Allowed'
};

const Demo = () => {
  const notification = useNotification({
    title: 'siberiacancode/reactuse',
    body: 'New reactuse version released.',
    tag: 'reactuse-notification',
    onClick: () => window.focus()
  });

  const disabled = !notification.supported || notification.permission === 'denied';

  const notify = async () => {
    const granted =
      notification.permission === 'granted' || (await notification.requestPermission());

    if (!granted) return;

    await notification.show();
  };

  const closeNotification = () => {
    notification.notification?.close();
    notification.close();
  };

  if (!notification.supported)
    return (
      <section className='border-border bg-card flex w-full max-w-sm flex-col gap-3 rounded-xl border p-4'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-foreground text-base font-semibold'>notification unavailable</h3>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            This browser does not support the Notification API.
          </p>
        </div>
      </section>
    );

  return (
    <section className='border-border bg-card text-card-foreground flex w-full max-w-sm flex-col gap-4 rounded-xl border p-4 shadow-sm'>
      <header className='flex items-start gap-3'>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-foreground text-base font-semibold'>[use]notification</h3>
            <span className='text-muted-foreground' data-slot='badge' data-variant='secondary'>
              {PERMISSION_LABELS[notification.permission]}
            </span>
          </div>

          <p className='text-muted-foreground text-sm leading-relaxed'>
            Request permission and show a desktop notification.
          </p>
        </div>
      </header>

      <div className='flex gap-2'>
        <button className='flex-1' disabled={disabled} type='button' onClick={notify}>
          Show notification
        </button>
        <button
          aria-label='Close notification'
          data-size='icon'
          data-variant='outline'
          disabled={!notification.notification}
          type='button'
          onClick={closeNotification}
        >
          <XIcon className='size-4' />
        </button>
      </div>
    </section>
  );
};

export default Demo;
