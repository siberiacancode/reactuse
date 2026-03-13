import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useDeviceOrientation } from '../useDeviceOrientation/useDeviceOrientation';
import { useOrientation } from '../useOrientation/useOrientation';
import { useRefState } from '../useRefState/useRefState';

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
  (target: HookTarget, options?: UseParallaxOptions): UseParallaxReturn;

  <Target extends Element>(
    options?: UseParallaxOptions,
    target?: never
  ): UseParallaxReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useParallax
 * @description - Hook to help create parallax effect
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 * @returns {UseParallaxReturn} An object of parallax values
 *
 * @example
 * const { value } = useParallax(ref);
 *
 * @overload
 * @template Target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 * @returns {UseParallaxReturn & { ref: StateRef<Target> }} An object of parallax values
 *
 * @example
 * const { ref, value } = useParallax();
 */
export const useParallax = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (params[1] ? params[1] : params[0]) as UseParallaxOptions | undefined;

  const internalRef = useRefState<Element>();

  const screenOrientation = useOrientation();
  const deviceOrientation = useDeviceOrientation();

  const {
    deviceOrientationRollAdjust = (value) => value,
    deviceOrientationTiltAdjust = (value) => value,
    mouseRollAdjust = (value) => value,
    mouseTiltAdjust = (value) => value
  } = (options ?? {}) as UseParallaxOptions;

  const [value, setValue] = useState({
    roll: 0,
    tilt: 0,
    source: 'mouse'
  });

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const onMouseMove = (event: MouseEvent) => {
      const { left, top } = element.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;

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
          const y = event.pageY - elementPositionY;
          const height = element.getBoundingClientRect().height;
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
          const x = event.pageX - elementPositionX;
          const width = element.getBoundingClientRect().width;
          const value = (x - width / 2) / width;
          return mouseTiltAdjust(value);
        }
      };

      const source = getSource();
      const roll = getRoll();
      const tilt = getTilt();

      setValue({
        roll,
        source,
        tilt
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    screenOrientation.value.angle,
    screenOrientation.value.orientationType,
    deviceOrientation.value.gamma,
    deviceOrientation.value.beta,
    deviceOrientation.value.alpha,
    deviceOrientation.value.absolute
  ]);

  if (target) return { value };

  return {
    ref: internalRef,
    value
  };
}) as UseParallax;
