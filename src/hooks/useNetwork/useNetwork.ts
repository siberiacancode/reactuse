import React from 'react';

import { isShallowEqual } from '@/utils/helpers';

export type ConnectionType = Connection['type'];
export type ConnectionEffectiveType = Connection['effectiveType'];

/** The use network return type */
export interface UseNetworkReturn {
  /** Indicates if the device is currently online */
  online: boolean;
  /** The estimated downlink speed in megabits per seconds */
  downlink?: Connection['downlink'];
  /** The maximum downlink speed, if available */
  downlinkMax?: Connection['downlinkMax'];
  /** The effective type of connection (e.g., '2g', '3g', '4g') */
  effectiveType?: Connection['effectiveType'];
  /** The estimated round-trip time in milliseconds */
  rtt?: Connection['rtt'];
  /** Indicates if the user has enabled data saving mode */
  saveData?: Connection['saveData'];
  /** The type of network connection (e.g., 'wifi', 'cellular') */
  type?: Connection['type'];
}

export const getConnection = () =>
  navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;

const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback, { passive: true });
  window.addEventListener('offline', callback, { passive: true });

  const connection = getConnection();

  if (connection) {
    connection.addEventListener('change', callback, { passive: true });
  }

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);

    if (connection) {
      connection.removeEventListener('change', callback);
    }
  };
};

const getServerSnapshot = () => {
  throw Error('useNetwork is a client side hook');
};

/**
 * @name useNetwork
 * @description - Hook to track network status.
 *
 * @returns {UseNetworkReturn} An object containing the network status.
 *
 * @example
 * const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
 */
export const useNetwork = (): UseNetworkReturn => {
  const cache = React.useRef<UseNetworkReturn>();

  const getSnapshot = () => {
    const online = navigator.onLine;
    const connection = getConnection();

    const nextState = {
      online,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type
    };

    if (cache.current && isShallowEqual(cache.current as any, nextState)) {
      return cache.current;
    }

    cache.current = nextState;
    return nextState;
  };

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
