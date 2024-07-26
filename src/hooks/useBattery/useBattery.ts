import { useEffect, useState } from 'react';

import type { BatteryManager } from '@/utils/types';

declare global {
  interface Navigator {
    readonly getBattery: () => Promise<BatteryManager>;
  }
}

/** State for hook use battery */
export interface UseBatteryStateReturn {
  /** Is battery API supported? */
  supported: boolean;
  /** Is battery information loading? */
  loading: boolean;
  /** Is charging battery? */
  charging: boolean;
  /** Time until the battery is fully charged */
  chargingTime: number;
  /** Time until the battery is completely discharged */
  dischargingTime: number;
  /** Battery charge level from 0 to 1 */
  level: number;
}

/**
 * @name useBattery
 * @description - Hook for getting information about battery status
 * @category Browser
 *
 * @returns {UseBatteryStateReturn} Object containing battery information & Battery API support
 *
 * @example
 * const { supported, loading, charging, chargingTime, dischargingTime, level } = useBattery();
 */
export const useBattery = () => {
  const [state, setState] = useState<UseBatteryStateReturn>({
    supported: false,
    loading: true,
    level: 0,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0
  });

  useEffect(() => {
    const supported =
      navigator && 'getBattery' in navigator && typeof navigator.getBattery === 'function';
    if (!supported) return setState({ ...state, loading: false });

    let battery: BatteryManager | null;

    const onChange = () =>
      setState({
        supported: true,
        loading: false,
        level: battery?.level ?? 0,
        charging: battery?.charging ?? false,
        dischargingTime: battery?.dischargingTime ?? 0,
        chargingTime: battery?.chargingTime ?? 0
      });

    navigator.getBattery().then((batteryManager) => {
      battery = batteryManager;
      onChange();

      batteryManager.addEventListener('levelchange', onChange);
      batteryManager.addEventListener('chargingchange', onChange);
      batteryManager.addEventListener('chargingtimechange', onChange);
      batteryManager.addEventListener('dischargingtimechange', onChange);
    });

    return () => {
      if (!battery) return;
      battery.removeEventListener('levelchange', onChange);
      battery.removeEventListener('chargingchange', onChange);
      battery.removeEventListener('chargingtimechange', onChange);
      battery.removeEventListener('dischargingtimechange', onChange);
    };
  }, []);

  return state;
};
