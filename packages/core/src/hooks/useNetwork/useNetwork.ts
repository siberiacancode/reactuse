import { useEffect, useRef, useState } from 'react';

export interface Connection extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'mixed'
    | 'none'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax';
  onChange: (event: Event) => void;
}

declare global {
  interface Navigator {
    readonly connection: Connection;
    readonly mozConnection: Connection;
    readonly webkitConnection: Connection;
  }
}

/** The type of network connection */
export type ConnectionType = Connection['type'];
/** The effective type of connection */
export type ConnectionEffectiveType = Connection['effectiveType'];

/** The use network return type */
export interface UseNetworkReturn {
  /** The estimated downlink speed in megabits per seconds */
  downlink?: Connection['downlink'];
  /** The maximum downlink speed, if available */
  downlinkMax?: Connection['downlinkMax'];
  /** The effective type of connection (e.g., '2g', '3g', '4g') */
  effectiveType?: Connection['effectiveType'];
  /** Indicates if the device is currently online */
  online: boolean;
  /** The estimated round-trip time in milliseconds */
  rtt?: Connection['rtt'];
  /** Indicates if the user has enabled data saving mode */
  saveData?: Connection['saveData'];
  /** The type of network connection (e.g., 'wifi', 'cellular') */
  type?: Connection['type'];
}

export const getConnection = () =>
  navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;

const getNetworkState = (): UseNetworkReturn => {
  if (typeof navigator === 'undefined') {
    return {
      online: false,
      type: undefined,
      effectiveType: undefined,
      saveData: false,
      downlink: 0,
      downlinkMax: 0,
      rtt: 0
    };
  }

  const online = navigator.onLine;
  const connection = getConnection();

  return {
    online,
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type
  };
};

/**
 * @name useNetwork
 * @description - Hook to track network status
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.connection https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 *
 * @param {(value: UseNetworkReturn) => void} [callback] The callback invoked when the network state changes
 * @returns {UseNetworkReturn} An object containing the network status
 *
 * @example
 * const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
 */
export const useNetwork = (callback?: (value: UseNetworkReturn) => void): UseNetworkReturn => {
  const [value, setValue] = useState(getNetworkState);
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const handleChange = () => {
      const nextValue = getNetworkState();

      setValue(nextValue);
      internalCallbackRef.current?.(nextValue);
    };

    window.addEventListener('online', handleChange, { passive: true });
    window.addEventListener('offline', handleChange, { passive: true });

    const connection = getConnection();

    if (connection) {
      connection.addEventListener('change', handleChange, { passive: true });
    }

    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);

      if (connection) {
        connection.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return value;
};
