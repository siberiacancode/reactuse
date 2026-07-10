import { useEffect, useRef, useState } from 'react';
import { usePermission } from '../usePermission/usePermission';
/**
 * @name useNotification
 * @description - Hook that provides a reactive wrapper around the browser Notifications API
 * @category Browser
 * @usage medium
 *
 * @browserapi Notification https://developer.mozilla.org/en-US/docs/Web/API/Notification
 *
 * @returns {UseNotificationReturn} An object containing the permission state and notification controls
 *
 * @example
 * const { supported, granted, notification, trigger, show, close } = useNotification();
 */
export const useNotification = () => {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window && !!window.Notification;
  const { state: granted } = usePermission('notifications');
  const [notification, setNotification] = useState();
  const notificationRef = useRef(undefined);
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
    const permission = await new Promise((resolve) => {
      // Safari < 16 only supports the callback form
      const request = window.Notification.requestPermission(resolve);
      if (request instanceof Promise) request.then(resolve);
    });
    return permission === 'granted';
  };
  const show = (params) => {
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
  return { supported, granted, notification, trigger, show, close };
};
