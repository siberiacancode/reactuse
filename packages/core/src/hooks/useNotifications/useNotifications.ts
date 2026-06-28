import { useEffect, useRef, useState } from 'react';

/** The notification permission state */
export type UseNotificationsPermission = 'default' | 'denied' | 'granted';

/** Default notification options */
export interface UseNotificationsParams extends NotificationOptions {
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

/** The use notifications return type */
export interface UseNotificationsReturn {
  /** The current Notification instance, if any */
  notification: Notification | null;
  /** Current notification permission state */
  permission: UseNotificationsPermission;
  /** Whether the Notifications API is supported in the current environment */
  supported: boolean;
  /** Close the current notification */
  close: () => void;
  /** Request notification permission from the user. Returns true if granted */
  requestPermission: () => Promise<boolean>;
  /** Show a desktop notification. Overrides merge with the params passed to the hook */
  show: (overrides?: UseNotificationsParams) => Promise<Notification | undefined>;
}

/**
 * @name useNotifications
 * @description - Hook that provides a reactive wrapper around the browser Notifications API
 * @category Browser
 * @usage medium
 *
 * @browserapi Notification https://developer.mozilla.org/en-US/docs/Web/API/Notification
 *
 * @param {UseNotificationsParams} [params] Default notification options and lifecycle callbacks
 * @returns {UseNotificationsReturn} An object containing permission state and notification controls
 *
 * @example
 * const { supported, permission, requestPermission, show, close } = useNotifications({
 *   title: 'Hello',
 *   body: 'World',
 *   onClick: (event) => console.log('clicked', event),
 * });
 */
export const useNotifications = (params?: UseNotificationsParams): UseNotificationsReturn => {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window && !!window.Notification;

  const [permission, setPermission] = useState<UseNotificationsPermission>(() =>
    supported ? Notification.permission : 'default'
  );
  const [notification, setNotification] = useState<Notification | null>(null);

  const permissionRef = useRef(permission);
  permissionRef.current = permission;

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const notificationRef = useRef<Notification | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    if (!supported) return false;
    if (permission === 'granted') return true;
    if (permission === 'denied') return false;

    const result = await Notification.requestPermission();
    permissionRef.current = result;
    setPermission(result);
    return result === 'granted';
  };

  const close = () => {
    notificationRef.current?.close();
    notificationRef.current = null;
    setNotification(null);
  };

  const show = async (overrides?: UseNotificationsParams): Promise<Notification | undefined> => {
    if (!supported || permissionRef.current !== 'granted') return undefined;

    const {
      title = '',
      onClick,
      onClose,
      onError,
      onShow,
      ...notificationOptions
    } = {
      ...paramsRef.current,
      ...overrides
    };

    const instance = new Notification(title, notificationOptions);

    instance.onclick = (event) => (overrides?.onClick ?? paramsRef.current?.onClick)?.(event);
    instance.onshow = (event) => (overrides?.onShow ?? paramsRef.current?.onShow)?.(event);
    instance.onerror = (event) => (overrides?.onError ?? paramsRef.current?.onError)?.(event);
    instance.onclose = (event) => {
      (overrides?.onClose ?? paramsRef.current?.onClose)?.(event);
      notificationRef.current = null;
      setNotification(null);
    };

    notificationRef.current = instance;
    setNotification(instance);
    return instance;
  };

  // Close current notification on unmount
  useEffect(
    () => () => {
      notificationRef.current?.close();
      notificationRef.current = null;
    },
    []
  );

  return {
    supported,
    permission,
    notification,
    requestPermission,
    show,
    close
  };
};
