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
