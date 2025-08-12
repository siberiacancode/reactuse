import { useEffect, useState } from 'react';
/**
 * @name useBattery
 * @description - Hook for getting information about battery status
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.getBattery https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery
 *
 * @returns {UseBatteryStateReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { supported, loading, charging, chargingTime, dischargingTime, level } = useBattery();
 */
export const useBattery = () => {
  const supported =
    typeof navigator !== 'undefined' &&
    'getBattery' in navigator &&
    typeof navigator.getBattery === 'function';
  const [value, setValue] = useState({
    loading: supported,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });
  useEffect(() => {
    if (!supported) return;
    let battery;
    const onChange = () =>
      setValue({
        loading: false,
        level: battery?.level ?? 0,
        charging: battery?.charging ?? false,
        dischargingTime: battery?.dischargingTime ?? 0,
        chargingTime: battery?.chargingTime ?? 0
      });
    navigator.getBattery().then((batteryManager) => {
      battery = batteryManager;
      onChange();
      battery.addEventListener('levelchange', onChange);
      battery.addEventListener('chargingchange', onChange);
      battery.addEventListener('chargingtimechange', onChange);
      battery.addEventListener('dischargingtimechange', onChange);
    });
    return () => {
      if (!battery) return;
      console.log('unmount', battery);
      battery.removeEventListener('levelchange', onChange);
      battery.removeEventListener('chargingchange', onChange);
      battery.removeEventListener('chargingtimechange', onChange);
      battery.removeEventListener('dischargingtimechange', onChange);
    };
  }, []);
  return { supported, value };
};
