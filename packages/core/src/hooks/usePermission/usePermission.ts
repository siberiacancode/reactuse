import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The permission name */
export type UsePermissionName =
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
  | 'speaker'
  | PermissionName;

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
 *  @browserapi navigator.permissions https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
 *
 *  @param {UsePermissionName} permissionDescriptorName - The permission name
 *  @param {boolean} [options.enabled=true] - Whether the permission is enabled
 *  @returns {UsePermissionReturn} An object containing the state and the supported status
 *
 *  @example
 *  const { state, supported, query } = usePermission('microphone');
 */
export const usePermission = (
  permissionDescriptorName: UsePermissionName,
  options?: UsePermissionOptions
) => {
  const supported = typeof navigator !== 'undefined' && 'permissions' in navigator;
  const [state, setState] = useState<PermissionState>('prompt');
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
