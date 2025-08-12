import { useEffect, useState } from 'react';
import { useEvent } from '../useEvent/useEvent';
/**
 *  @name usePermission
 *  @description - Hook that gives you the state of permission
 *  @category Browser
 *  @usage medium
 *
 *  @browserapi navigator.permissions https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
 *
 *  @param {UsePermissionName} permissionDescriptorName - The permission name
 *  @param {boolean} [options.enabled=true] - Whether the permission is enabled
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = (permissionDescriptorName, options) => {
  const supported = typeof navigator !== 'undefined' && 'permissions' in navigator;
  const [state, setState] = useState('prompt');
  const enabled = options?.enabled ?? true;
  const permissionDescriptor = { name: permissionDescriptorName };
  const query = useEvent(async () => {
    try {
      const permissionStatus = await navigator.permissions.query(permissionDescriptor);
      setState(permissionStatus.state);
      return permissionStatus.state;
    } catch {
      setState('prompt');
      return 'prompt';
    }
  });
  useEffect(() => {
    if (!supported || !enabled) return;
    query();
    window.addEventListener('change', query);
    return () => {
      window.removeEventListener('change', query);
    };
  }, [permissionDescriptorName, enabled]);
  return {
    state,
    supported,
    query
  };
};
