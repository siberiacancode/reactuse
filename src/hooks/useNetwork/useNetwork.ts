import React from 'react';

import { isShallowEqual } from '@/utils/helpers';

export type ConnectionType = Connection['type'];
export type ConnectionEffectiveType = Connection['effectiveType'];
export interface UseNetworkReturn {
  online: boolean;
  downlink?: Connection['downlink'];
  downlinkMax?: Connection['downlinkMax'];
  effectiveType?: Connection['effectiveType'];
  rtt?: Connection['rtt'];
  saveData?: Connection['saveData'];
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
