import { useEffect, useRef, useState } from 'react';
/**
 *  @name usePermission
 *  @description - Hook that gives you the state of permission
 *  @category Browser
 *  @usage medium
 *
 *  @browserapi navigator.permissions https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
 *
 *  @overload
 *  @param {UsePermissionName} name The permission name
 *  @param {(state: PermissionState) => void} [callback] The callback fired when the permission state changes
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone', (state) => console.log(state));
 *
 *  @overload
 *  @param {UsePermissionName} name The permission name
 *  @param {(state: PermissionState) => void} [options.onChange] The callback fired when the permission state changes
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = (...params) => {
  const name = params[0];
  const options = typeof params[1] === 'function' ? { onChange: params[1] } : params[1];
  const supported =
    typeof navigator !== 'undefined' && 'permissions' in navigator && !!navigator.permissions;
  const [state, setState] = useState('prompt');
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const query = async () => {
    if (!supported) return 'prompt';
    try {
      const status = await navigator.permissions.query({ name });
      setState(status.state);
      return status.state;
    } catch {
      setState('prompt');
      return 'prompt';
    }
  };
  useEffect(() => {
    if (!supported) return;
    let status;
    const onChange = () => {
      setState(status.state);
      optionsRef.current?.onChange?.(status.state);
    };
    const subscribe = async () => {
      try {
        status = await navigator.permissions.query({ name });
        setState(status.state);
        status.addEventListener('change', onChange);
      } catch {
        setState('prompt');
      }
    };
    subscribe();
    return () => {
      if (!status) return;
      status.removeEventListener('change', onChange);
    };
  }, [name]);
  return {
    state,
    supported,
    query
  };
};
