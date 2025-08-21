import { useEffect, useState } from 'react';

export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

declare global {
  interface Navigator {
    readonly getBattery: () => Promise<BatteryManager>;
  }
}

/** The use battery value type */
export interface UseBatteryValue {
  /** Is charging battery? */
  charging: boolean;
  /** Time until the battery is fully charged */
  chargingTime: number;
  /** Time until the battery is completely discharged */
  dischargingTime: number;
  /** Battery charge level from 0 to 1 */
  level: number;
  /** Is battery information loading? */
  loading: boolean;
}

/** The use battery return type */
export interface UseBatteryStateReturn {
  /** Whether the battery api is supported*/
  supported: boolean;
  /** The use battery value type  */
  value: UseBatteryValue;
}

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
export const useBattery = (): UseBatteryStateReturn => {
  const supported =
    typeof navigator !== 'undefined' &&
    'getBattery' in navigator &&
    typeof navigator.getBattery === 'function';

  const [value, setValue] = useState<UseBatteryValue>({
    loading: supported,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });

  useEffect(() => {
    if (!supported) return;

    let battery: BatteryManager | null;

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
      battery.removeEventListener('levelchange', onChange);
      battery.removeEventListener('chargingchange', onChange);
      battery.removeEventListener('chargingtimechange', onChange);
      battery.removeEventListener('dischargingtimechange', onChange);
    };
  }, []);

  return { supported, value };
};
