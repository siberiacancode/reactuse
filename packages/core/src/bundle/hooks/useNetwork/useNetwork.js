import { useEffect, useRef, useState } from 'react';
export const getConnection = () =>
  navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
const getNetworkState = () => {
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
export const useNetwork = (callback) => {
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
