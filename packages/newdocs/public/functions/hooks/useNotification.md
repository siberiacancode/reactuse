---
title: useNotification
description: Hook that provides a reactive wrapper around the browser Notifications API
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783690580000
---

# useNotification

Hook that provides a reactive wrapper around the browser Notifications API

## Demo

```tsx
import { useNotification, usePermission } from '@siberiacancode/reactuse';
import { BellIcon, CheckIcon } from 'lucide-react';

const NOTIFICATION = {
  title: 'siberiacancode/reactuse',
  body: 'New reactuse version released.',
  icon: '/logo.svg',
  onClick: () => window.focus()
};

const Demo = () => {
  const notification = useNotification();
  const permission = usePermission('notifications');

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

        {permission.state === 'granted' && (
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

        {permission.state === 'prompt' && (
          <button className='w-full rounded-full!' type='button' onClick={onSubscribe}>
            Subscribe
          </button>
        )}

        {permission.state === 'denied' && (
          <p className='text-muted-foreground text-center text-xs leading-relaxed'>
            Notifications are turned off. You can enable them again from your browser settings.
          </p>
        )}
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useNotification
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use notification params type */
export interface UseNotificationParams extends NotificationOptions {
  /** The title of the notification */
  title?: string;
  /** Called when a notification is clicked */
  onClick?: (event: Event) => void;
  /** Called when a notification is closed */
  onClose?: (event: Event) => void;
  /** Called when a notification encounters an error */
  onError?: (event: Event) => void;
  /** Called when a notification is shown */
  onShow?: (event: Event) => void;
}

/** The use notification return type */
export interface UseNotificationReturn {
  /** The current Notification instance, if any */
  notification: Notification | undefined;
  /** Whether the Notifications API is supported in the current environment */
  supported: boolean;
  /** Close the current notification */
  close: () => void;
  /** Show a desktop notification */
  show: (params?: UseNotificationParams) => Notification | undefined;
  /** Request notification permission from the user. Returns true if granted */
  trigger: () => Promise<boolean>;
}

/**
 * @name useNotification
 * @description - Hook that provides a reactive wrapper around the browser Notifications API
 * @category Browser
 * @usage medium
 *
 * @browserapi Notification https://developer.mozilla.org/en-US/docs/Web/API/Notification
 *
 * @returns {UseNotificationReturn} An object containing the notification instance and controls
 *
 * @example
 * const { supported, notification, trigger, show, close } = useNotification();
 */
export const useNotification = (): UseNotificationReturn => {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window && !!window.Notification;

  const [notification, setNotification] = useState<Notification>();

  const notificationRef = useRef<Notification | undefined>(undefined);

  const close = () => {
    if (!notificationRef.current) return;

    notificationRef.current.close();
    notificationRef.current = undefined;
    setNotification(undefined);
  };

  const trigger = async () => {
    if (!supported) return false;
    if (window.Notification.permission !== 'default')
      return window.Notification.permission === 'granted';

    const permission = await new Promise<NotificationPermission>((resolve) => {
      // Safari < 16 only supports the callback form
      const request = window.Notification.requestPermission(resolve);
      if (request instanceof Promise) request.then(resolve);
    });

    return permission === 'granted';
  };

  const show = (params?: UseNotificationParams) => {
    if (!supported || window.Notification.permission !== 'granted') return;

    close();

    const { title = '', onClick, onClose, onError, onShow, ...options } = params ?? {};

    const instance = new window.Notification(title, options);

    instance.onclick = (event) => onClick?.(event);
    instance.onshow = (event) => onShow?.(event);
    instance.onerror = (event) => onError?.(event);
    instance.onclose = (event) => {
      onClose?.(event);

      if (notificationRef.current !== instance) return;
      notificationRef.current = undefined;
      setNotification(undefined);
    };

    notificationRef.current = instance;
    setNotification(instance);
    return instance;
  };

  useEffect(() => {
    if (!supported) return;

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      close();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (!notificationRef.current) return;
      notificationRef.current.close();
      notificationRef.current = undefined;
    };
  }, [supported]);

  return { supported, notification, trigger, show, close };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, notification, trigger, show, close } = useNotification();
```

## Type Declarations

```tsx
export interface UseNotificationParams extends NotificationOptions {
  /** The title of the notification */
  title?: string;
  /** Called when a notification is clicked */
  onClick?: (event: Event) => void;
  /** Called when a notification is closed */
  onClose?: (event: Event) => void;
  /** Called when a notification encounters an error */
  onError?: (event: Event) => void;
  /** Called when a notification is shown */
  onShow?: (event: Event) => void;
}

export interface UseNotificationReturn {
  /** The current Notification instance, if any */
  notification: Notification | undefined;
  /** Whether the Notifications API is supported in the current environment */
  supported: boolean;
  /** Close the current notification */
  close: () => void;
  /** Show a desktop notification */
  show: (params?: UseNotificationParams) => Notification | undefined;
  /** Request notification permission from the user. Returns true if granted */
  trigger: () => Promise<boolean>;
}
```

## API

### Returns

`UseNotificationReturn` - An object containing the notification instance and controls