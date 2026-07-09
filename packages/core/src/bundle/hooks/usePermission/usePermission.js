import { useEffect, useRef, useState } from 'react';
/**
 *  @name usePermission
 *  @description - Hook that gives you the state of permission
 *  @category Browser
 *  @usage medium
 *
 *  @browserapi navigator.permissions https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
 *
 *  @param {UsePermissionName} name - The permission name
 *  @param {boolean} [options.immediately=true] - Whether the permission should be queried immediately
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = (name, options) => {
  const supported =
    typeof navigator !== 'undefined' && 'permissions' in navigator && !!navigator.permissions;
  const immediately = options?.immediately ?? true;
  const [state, setState] = useState('prompt');
  const statusRef = useRef(null);
  const onChange = () => setState(statusRef.current.state);
  const query = async () => {
    if (!supported) return 'prompt';
    try {
      const status = await navigator.permissions.query({ name });
      statusRef.current = status;
      status.addEventListener('change', onChange);
      setState(status.state);
      return status.state;
    } catch {
      setState('prompt');
      return 'prompt';
    }
  };
  useEffect(() => {
    if (immediately) query();
    return () => {
      if (!statusRef.current) return;
      statusRef.current.removeEventListener('change', onChange);
    };
  }, [name]);
  return {
    state,
    supported,
    query
  };
};
