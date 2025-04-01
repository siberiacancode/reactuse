import { useEffect, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useDeviceOrientation } from '../useDeviceOrientation/useDeviceOrientation';
import { useRefState } from '../useRefState/useRefState';
import { useScreenOrientation } from '../useScreenOrientation/useScreenOrientation';
/**
 * @name useParallax
 * @description - Hook to help create parallax effect
 * @category Sensors
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
export const useParallax = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = params[1] ? params[1] : params[0];
  const internalRef = useRefState();
  const screenOrientation = useScreenOrientation();
  const deviceOrientation = useDeviceOrientation();
  const {
    deviceOrientationRollAdjust = (value) => value,
    deviceOrientationTiltAdjust = (value) => value,
    mouseRollAdjust = (value) => value,
    mouseTiltAdjust = (value) => value
  } = options ?? {};
  const [value, setValue] = useState({
    roll: 0,
    tilt: 0,
    source: 'mouse'
  });
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    console.log('element', element);
    const onMouseMove = (event) => {
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
          let value;
          switch (screenOrientation.value.orientationType) {
            case 'landscape-primary':
              value = deviceOrientation.value.gamma / 90;
              break;
            case 'landscape-secondary':
              value = -deviceOrientation.value.gamma / 90;
              break;
            case 'portrait-primary':
              value = -deviceOrientation.value.beta / 90;
              break;
            case 'portrait-secondary':
              value = deviceOrientation.value.beta / 90;
              break;
            default:
              value = -deviceOrientation.value.beta / 90;
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
          let value;
          switch (screenOrientation.value.orientationType) {
            case 'landscape-primary':
              value = deviceOrientation.value.beta / 90;
              break;
            case 'landscape-secondary':
              value = -deviceOrientation.value.beta / 90;
              break;
            case 'portrait-primary':
              value = deviceOrientation.value.gamma / 90;
              break;
            case 'portrait-secondary':
              value = -deviceOrientation.value.gamma / 90;
              break;
            default:
              value = deviceOrientation.value.gamma / 90;
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
    target,
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
};
