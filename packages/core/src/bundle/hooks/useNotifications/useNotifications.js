import { useEffect, useRef, useState } from 'react';
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
export const useNotifications = (params) => {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window && !!window.Notification;
  const [permission, setPermission] = useState(() =>
    supported ? Notification.permission : 'default'
  );
  const [notification, setNotification] = useState(null);
  const permissionRef = useRef(permission);
  permissionRef.current = permission;
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const notificationRef = useRef(null);
  const requestPermission = async () => {
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
  const show = async (overrides) => {
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
