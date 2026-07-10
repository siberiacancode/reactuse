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

/** The use permission callback type */
export type UsePermissionCallback = (state: PermissionState) => void;

/** The use permission options type */
export interface UsePermissionOptions {
  /** The callback fired when the permission state changes */
  onChange?: UsePermissionCallback;
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

export interface UsePermission {
  (name: UsePermissionName, callback?: UsePermissionCallback): UsePermissionReturn;

  (name: UsePermissionName, options?: UsePermissionOptions): UsePermissionReturn;
}

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
export const usePermission = ((...params: any[]) => {
  const name = params[0] as UsePermissionName;

  const options = (typeof params[1] === 'function' ? { onChange: params[1] } : params[1]) as
    | UsePermissionOptions
    | undefined;

  const supported =
    typeof navigator !== 'undefined' && 'permissions' in navigator && !!navigator.permissions;

  const [state, setState] = useState<PermissionState>('prompt');

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const query = async () => {
    if (!supported) return 'prompt' as const;

    try {
      const status = await navigator.permissions.query({ name } as PermissionDescriptor);

      setState(status.state);
      return status.state;
    } catch {
      setState('prompt');
      return 'prompt' as const;
    }
  };

  useEffect(() => {
    if (!supported) return;

    let status: PermissionStatus | undefined;

    const onChange = () => {
      setState(status!.state);
      optionsRef.current?.onChange?.(status!.state);
    };

    const subscribe = async () => {
      try {
        status = await navigator.permissions.query({ name } as PermissionDescriptor);

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
}) as UsePermission;
