import { useEffect, useState } from 'react';
export const getConnection = () =>
  navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
/**
 * @name useNetwork
 * @description - Hook to track network status
 * @category Sensors
 *
 * @returns {UseNetworkReturn} An object containing the network status
 *
 * @example
 * const { online, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetwork();
 */
export const useNetwork = () => {
  const [value, setValue] = useState(() => {
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
  });
  useEffect(() => {
    const callback = () => {
      const online = navigator.onLine;
      const connection = getConnection();
      setValue({
        online,
        downlink: connection?.downlink,
        downlinkMax: connection?.downlinkMax,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
        type: connection?.type
      });
    };
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
  });
  return value;
};
