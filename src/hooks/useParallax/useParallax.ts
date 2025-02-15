import { useEffect, useState } from 'react';

import type { UseMouseTarget } from '../useMouse/useMouse';

import { useDeviceOrientation } from '../useDeviceOrientation/useDeviceOrientation';
import { useMouse } from '../useMouse/useMouse';
import { useRefState } from '../useRefState/useRefState';
import { useScreenOrientation } from '../useScreenOrientation/useScreenOrientation';

/** The use parallax value type */
export interface UseParallaxValue {
  /** Roll value. Scaled to `-0.5 ~ 0.5` */
  roll: number;
  /** Sensor source, can be `mouse` or `deviceOrientation` */
  source: 'deviceOrientation' | 'mouse';
  /** Tilt value. Scaled to `-0.5 ~ 0.5` */
  tilt: number;
}

/** The use parallax options type */
export interface UseParallaxOptions {
  /** Device orientation roll adjust function */
  deviceOrientationRollAdjust?: (value: number) => number;
  /** Device orientation tilt adjust function */
  deviceOrientationTiltAdjust?: (value: number) => number;
  /** Mouse roll adjust function */
  mouseRollAdjust?: (value: number) => number;
  /** Mouse tilt adjust function */
  mouseTiltAdjust?: (value: number) => number;
}

interface UseParallaxReturn {
  value: UseParallaxValue;
}

export interface UseParallax {
  <Target extends UseMouseTarget>(target: Target, options?: UseParallaxOptions): UseParallaxReturn;

  <Target extends UseMouseTarget>(
    params?: UseParallaxOptions
  ): UseParallaxReturn & {
    ref: (node: Target) => void;
  };
}

/**
 * @name useParallax
 * @description - Hook to help create parallax effect
 * @category Sensors
 *
 * @overload
 * @template Target The target element for the parallax effect
 * @param {Target} target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 * @returns {UseParallaxReturn} An object with the current mouse position
 *
 * @example
 * const { roll, tilt, source } = useParallax(ref);
 *
 * @overload
 * @template Target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 *
 * @example
 * const { ref, roll, tilt, source } = useParallax();
 */
export const useParallax = ((...params: any[]) => {
  const target =
    params[0] instanceof Function ||
    (params[0] && 'current' in params[0]) ||
    params[0] instanceof Element
      ? params[0]
      : undefined;

  const internalRef = useRefState<Element>();

  const mouse = useMouse(target ?? internalRef.current);
  const screenOrientation = useScreenOrientation();
  const deviceOrientation = useDeviceOrientation();

  const {
    deviceOrientationRollAdjust = (value) => value,
    deviceOrientationTiltAdjust = (value) => value,
    mouseRollAdjust = (value) => value,
    mouseTiltAdjust = (value) => value
  } = ((target ? params[1] : params[0]) ?? {}) as UseParallaxOptions;

  const [value, setValue] = useState({
    roll: 0,
    tilt: 0,
    source: 'mouse'
  });

  const getSource = () => {
    const isDeviceOrientation =
      deviceOrientation.supported &&
      (deviceOrientation.value.alpha || deviceOrientation.value.gamma);

    if (isDeviceOrientation) return 'deviceOrientation';
    return 'mouse';
  };

  const getRoll = () => {
    const source = getSource();
    if (source === 'deviceOrientation') {
      let value: number;
      switch (screenOrientation.value.orientationType) {
        case 'landscape-primary':
          value = deviceOrientation.value.gamma! / 90;
          break;
        case 'landscape-secondary':
          value = -deviceOrientation.value.gamma! / 90;
          break;
        case 'portrait-primary':
          value = -deviceOrientation.value.beta! / 90;
          break;
        case 'portrait-secondary':
          value = deviceOrientation.value.beta! / 90;
          break;
        default:
          value = -deviceOrientation.value.beta! / 90;
      }
      return deviceOrientationRollAdjust(value);
    } else {
      if (!mouse.element) return 0;
      const y = mouse.y - mouse.elementPositionY;
      const height = mouse.element.getBoundingClientRect().height;
      const value = -(y - height / 2) / height;
      return mouseRollAdjust(value);
    }
  };

  const getTilt = () => {
    const source = getSource();
    if (source === 'deviceOrientation') {
      let value: number;
      switch (screenOrientation.value.orientationType) {
        case 'landscape-primary':
          value = deviceOrientation.value.beta! / 90;
          break;
        case 'landscape-secondary':
          value = -deviceOrientation.value.beta! / 90;
          break;
        case 'portrait-primary':
          value = deviceOrientation.value.gamma! / 90;
          break;
        case 'portrait-secondary':
          value = -deviceOrientation.value.gamma! / 90;
          break;
        default:
          value = deviceOrientation.value.gamma! / 90;
      }
      return deviceOrientationTiltAdjust(value);
    } else {
      if (!mouse.element) return 0;
      const x = mouse.x - mouse.elementPositionX;
      const width = mouse.element.getBoundingClientRect().width;
      const value = (x - width / 2) / width;
      return mouseTiltAdjust(value);
    }
  };

  useEffect(() => {
    if (!mouse.element) return;

    const source = getSource();
    const roll = getRoll();
    const tilt = getTilt();

    setValue({
      roll,
      source,
      tilt
    });
  }, [
    screenOrientation.value.angle,
    screenOrientation.value.orientationType,
    deviceOrientation.value.gamma,
    deviceOrientation.value.beta,
    deviceOrientation.value.alpha,
    deviceOrientation.value.absolute,
    mouse.x,
    mouse.y,
    mouse.element
  ]);

  if (target) return { value };
  return { ref: internalRef, value };
}) as UseParallax;
