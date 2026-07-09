import { useEffect, useRef, useState } from 'react';

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
  | 'local-fonts'
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
  /** Whether the permission should be queried immediately */
  immediately?: boolean;
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
export const usePermission = (
  name: UsePermissionName,
  options?: UsePermissionOptions
): UsePermissionReturn => {
  const supported =
    typeof navigator !== 'undefined' && 'permissions' in navigator && !!navigator.permissions;

  const immediately = options?.immediately ?? true;

  const [state, setState] = useState<PermissionState>('prompt');

  const statusRef = useRef<PermissionStatus | null>(null);

  const onChange = () => setState(statusRef.current!.state);

  const query = async () => {
    if (!supported) return 'prompt' as const;
    try {
      const status = await navigator.permissions.query({ name } as PermissionDescriptor);
      statusRef.current = status;
      status.addEventListener('change', onChange);
      setState(status.state);
      return status.state;
    } catch {
      setState('prompt');
      return 'prompt' as const;
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
