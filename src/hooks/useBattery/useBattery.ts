import React from 'react';

/** Interface for battery status */
export interface BatteryState {
  charging: boolean | null /** Is charging battery? */;
  chargingTime: number | null /** Time until the battery is fully charged */;
  dischargingTime: number | null /** Time until the battery is completely discharged */;
  level: number | null /** Battery charge level from 0 to 1 */;
}

/** A type that combines battery state and EventTarget to listen for events */
type BatteryManager = BatteryState & EventTarget;

/** Extending the Navigator interface to include the getBattery method, because it's not describe in TS */
interface NavigatorBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

/** Checks the existence of navigator object */
const nav: NavigatorBattery | undefined = typeof navigator !== 'undefined' ? navigator : undefined;

/** Checks the existence of getBattery method */
const isBatterySupported = nav && typeof nav.getBattery === 'function';

/** State for hook UseBattery */
type UseBatteryState = BatteryState & { isSupported: boolean; loading: boolean };

/**
 * Hook for getting information about battery status
 *
 * @returns {UseBatteryState} Object containing battery information & Battery API support
 */
export const useBattery = () => {
  const [state, setState] = React.useState<UseBatteryState>({
    isSupported: true,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null
  });

  React.useEffect(() => {
    /** Battery API is not supported, return isSupported: false */
    if (!isBatterySupported)
      setState((prevState) => ({ ...prevState, isSupported: false, loading: false }));

    let isMounted = true;
    let battery: BatteryManager | null = null;

    /** Battery state change handler */
    const handleChange = () => {
      if (!isMounted || !battery) return null;
      setState({
        isSupported: true,
        loading: true,
        level: battery.level,
        charging: battery.charging,
        dischargingTime: battery.dischargingTime,
        chargingTime: battery.chargingTime
      });
    };

    /** Getting battery information and adding event listeners */
    nav!.getBattery!()
      .then((b) => {
        // eslint-disable-next-line promise/always-return
        if (!isMounted) return null;
        battery = b;
        battery.addEventListener('levelchange', handleChange);
        battery.addEventListener('chargingchange', handleChange);
        battery.addEventListener('chargingtimechange', handleChange);
        battery.addEventListener('dischargingtimechange', handleChange);
        handleChange();
      })
      .catch((error) => {
        console.log('Failed to get battery:', error);
        setState((prevState) => ({ ...prevState, loading: false }));
      });

    /** Clearing event listeners when a component is unmounted */
    return () => {
      isMounted = false;

      if (battery) {
        battery.removeEventListener('levelchange', handleChange);
        battery.removeEventListener('chargingchange', handleChange);
        battery.removeEventListener('chargingtimechange', handleChange);
        battery.removeEventListener('dischargingtimechange', handleChange);
      }
    };
  }, []);

  return state;
};
