import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The permission name */
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

/** The use permission options type */
export interface UsePermissionOptions {
  /** Whether the permission is enabled */
  enabled: boolean;
}

/** The use permission return type */
export interface UsePermissionReturn {
  /** The permission state */
  state: PermissionState;
  /** The permission supported status */
  supported: boolean;
  /** The permission query function */
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
export const usePermission = (
  permissionDescriptorName: UsePermissionName,
  options?: UsePermissionOptions
) => {
  const [state, setState] = useState<PermissionState>('prompt');
  const supported = navigator && 'permissions' in navigator;
  const enabled = options?.enabled ?? true;

  const permissionDescriptor = { name: permissionDescriptorName };

  const query = useEvent(async () => {
    try {
      const permissionStatus = await navigator.permissions.query(
        permissionDescriptor as PermissionDescriptor
      );
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
