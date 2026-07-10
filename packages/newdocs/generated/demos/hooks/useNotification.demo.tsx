'use client'

import { useNotification } from '@siberiacancode/reactuse';
import { BellIcon, CheckIcon } from 'lucide-react';

const NOTIFICATION = {
  title: 'siberiacancode/reactuse',
  body: 'New reactuse version released.',
  icon: '/logo.svg',
  onClick: () => window.focus()
};

const Demo = () => {
  const notification = useNotification();

  const onSubscribe = async () => {
    const granted = await notification.trigger();
    if (!granted) return;

    notification.show(NOTIFICATION);
  };

  if (!notification.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Notification'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-full justify-center p-4'>
      <div className='border-border bg-card flex w-full max-w-xs flex-col items-center gap-8 rounded-t-3xl border border-b-0 px-6 pt-8 pb-7 shadow-lg'>
        <div className='flex flex-col items-center gap-5'>
          <div className='bg-muted-foreground/20 h-1 w-10 rounded-full' />

          <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
            <BellIcon className='size-7' />
          </div>

          <div className='flex flex-col items-center gap-1.5 text-center'>
            <h3 className='text-xl!'>Stay in the loop</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Subscribe to get notified about new hooks, releases, and everything happening with{' '}
              <span className='text-foreground font-medium'>reactuse</span>.
            </p>
          </div>
        </div>

        {notification.granted === 'granted' && (
          <div className='flex w-full flex-col items-center gap-3'>
            <div className='border-border text-foreground flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-medium'>
              <CheckIcon className='text-primary size-4' />
              You're subscribed
            </div>

            <button
              className='text-muted-foreground text-xs underline underline-offset-4'
              data-variant='ghost'
              type='button'
              onClick={() => notification.show(NOTIFICATION)}
            >
              Try it again
            </button>
          </div>
        )}

        {notification.granted === 'prompt' && (
          <button className='w-full rounded-full!' type='button' onClick={onSubscribe}>
            Subscribe
          </button>
        )}

        {notification.granted === 'denied' && (
          <p className='text-muted-foreground text-center text-xs leading-relaxed'>
            Notifications are turned off. You can enable them again from your browser settings.
          </p>
        )}
      </div>
    </section>
  );
};

export default Demo;
