import { useNotifications } from '@siberiacancode/reactuse';
import { BellIcon, CheckIcon, PackageCheckIcon, ShieldAlertIcon, XIcon } from 'lucide-react';

const UPDATES = [
  {
    title: 'ReactUse release',
    body: 'SiberiaCanCode published a new hook pack for your project.',
    icon: PackageCheckIcon
  },
  {
    title: 'Demo copied',
    body: 'The reactuse example is ready to paste into your app.',
    icon: CheckIcon
  },
  {
    title: 'Community ping',
    body: 'A new issue on SiberiaCanCode/reactuse needs a quick look.',
    icon: ShieldAlertIcon
  }
];

const Demo = () => {
  const notifications = useNotifications({
    tag: 'reactuse-update',
    onClick: () => window.focus()
  });

  const disabled = !notifications.supported || notifications.permission === 'denied';

  const notify = async (update: (typeof UPDATES)[number]) => {
    const granted =
      notifications.permission === 'granted' || (await notifications.requestPermission());

    if (!granted) return;

    await notifications.show({
      title: update.title,
      body: update.body
    });
  };

  if (!notifications.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Notification'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-md flex-col gap-5 p-4'>
      <header className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-foreground text-xl font-semibold'>reactuse alerts</h3>
          <p className='text-muted-foreground text-sm'>
            Send small desktop updates from the siberiacancode toolkit while working with reactuse.
          </p>
        </div>

        <div className='bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg'>
          <BellIcon className='size-5' />
        </div>
      </header>

      <div className='flex flex-col gap-2'>
        {UPDATES.map((update) => {
          const Icon = update.icon;

          return (
            <button
              key={update.title}
              className='border-border bg-card text-card-foreground hover:bg-muted/60 flex h-auto w-full items-center justify-start gap-3 rounded-lg border px-3 py-3 text-left'
              disabled={disabled}
              type='button'
              onClick={() => notify(update)}
            >
              <span className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-md'>
                <Icon className='size-4' />
              </span>
              <span className='flex min-w-0 flex-col gap-0.5'>
                <span className='truncate text-sm font-medium'>{update.title}</span>
                <span className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
                  {update.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <footer className='text-muted-foreground flex items-center justify-between gap-3 border-t pt-4 text-xs'>
        <span>
          Permission: <b className='text-foreground'>{notifications.permission}</b>
        </span>

        <button
          className='h-8! rounded-lg px-3 text-xs'
          disabled={!notifications.notification}
          type='button'
          onClick={notifications.close}
        >
          <XIcon className='size-3.5' />
          Close
        </button>
      </footer>
    </section>
  );
};

export default Demo;
