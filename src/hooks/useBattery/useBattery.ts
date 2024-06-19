import { useEffect, useState } from 'react';

/** State for hook use battery */
interface UseBatteryStateReturn {
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
    const isSupported =
      navigator && 'getBattery' in navigator && typeof navigator.getBattery === 'function';
    if (!isSupported) return setState({ ...state, loading: false });

    let battery: BatteryManager | null;

    const handleChange = () =>
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
      handleChange();

      batteryManager.addEventListener('levelchange', handleChange);
      batteryManager.addEventListener('chargingchange', handleChange);
      batteryManager.addEventListener('chargingtimechange', handleChange);
      batteryManager.addEventListener('dischargingtimechange', handleChange);
    });

    return () => {
      if (!battery) return;
      battery.removeEventListener('levelchange', handleChange);
      battery.removeEventListener('chargingchange', handleChange);
      battery.removeEventListener('chargingtimechange', handleChange);
      battery.removeEventListener('dischargingtimechange', handleChange);
    };
  }, []);

  return state;
};
