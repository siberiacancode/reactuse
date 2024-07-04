import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

export type UsePermissionName =
  | PermissionName
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker';

export interface UsePermissionReturn {
  state: PermissionState;
  supported: boolean;
  query: () => Promise<PermissionState>;
}

/**
 *  @name usePermission
 *  @description - Hook that gives you the state of permission
 *  @category Browser
 *
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = (permissionDescriptorName: UsePermissionName) => {
  const [state, setState] = useState<PermissionState>('prompt');
  const supported = navigator && 'permissions' in navigator;

  const permissionDescriptor = { name: permissionDescriptorName };

  const query = useEvent(async () => {
    try {
      const permissionStatus = await navigator.permissions.query(
        permissionDescriptor as PermissionDescriptor
      );
      setState(permissionStatus.state);
      return permissionStatus.state;
    } catch (error) {
      setState('prompt');
      return 'prompt';
    }
  });

  useEffect(() => {
    if (!supported) return;
    query();
    window.addEventListener('change', query);
    return () => {
      window.removeEventListener('change', query);
    };
  }, [permissionDescriptorName]);

  return {
    state,
    supported,
    query
  };
};
