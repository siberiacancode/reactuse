import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';
const DEFAULT_ADJUST = (value) => value;
export const getDeviceOrientationParallax = (beta, gamma, orientationType) => {
  if (beta === null || gamma === null) return null;
  switch (orientationType) {
    case 'landscape-primary':
      return { roll: gamma / 90, tilt: beta / 90 };
    case 'landscape-secondary':
      return { roll: -gamma / 90, tilt: -beta / 90 };
    case 'portrait-secondary':
      return { roll: beta / 90, tilt: -gamma / 90 };
    case 'portrait-primary':
    default:
      return { roll: -beta / 90, tilt: gamma / 90 };
  }
};
export const getMouseParallax = (event, element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  const elementPositionX = left + window.scrollX;
  const elementPositionY = top + window.scrollY;
  return {
    roll: -(event.pageY - elementPositionY - height / 2) / height,
    tilt: (event.pageX - elementPositionX - width / 2) / width
  };
};
/**
 * @name useParallax
 * @description - Hook to help create parallax effect
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element for the parallax effect
 * @param {(value: UseParallaxValue, event: Event) => void} [callback] The callback invoked on parallax updates
 * @returns {UseParallaxReturn} An object with parallax snapshot controls
 *
 * @example
 * const { snapshot, watch } = useParallax(ref, (value) => console.log(value));
 *
 * @overload
 * @param {HookTarget} target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 * @returns {UseParallaxReturn} An object with parallax snapshot controls
 *
 * @example
 * const { snapshot, watch } = useParallax(ref, options);
 *
 * @overload
 * @template Target The target element for the parallax effect
 * @param {(value: UseParallaxValue, event: Event) => void} [callback] The callback invoked on parallax updates
 * @returns {UseParallaxReturn & { ref: StateRef<Target> }} An object with parallax snapshot controls and a ref
 *
 * @example
 * const { ref, snapshot, watch } = useParallax<HTMLDivElement>((value) => console.log(value));
 *
 * @overload
 * @template Target The target element for the parallax effect
 * @param {UseParallaxOptions} options The options for the parallax effect
 * @returns {UseParallaxReturn & { ref: StateRef<Target> }} An object with parallax snapshot controls and a ref
 *
 * @example
 * const { ref, snapshot, watch } = useParallax<HTMLDivElement>(options);
 */
export const useParallax = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'function'
      ? { ...params[2], onChange: params[1] }
      : params[1]
    : typeof params[0] === 'function'
      ? { ...params[1], onChange: params[0] }
      : params[0];
  const supported =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    'DeviceOrientationEvent' in window &&
    !!window.DeviceOrientationEvent &&
    'screen' in window &&
    'orientation' in window.screen &&
    !!window.screen.orientation;
  const orientation = supported ? window.screen.orientation : undefined;
  const internalRef = useRefState();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;
  const snapshotRef = useRef({
    roll: 0,
    tilt: 0,
    source: 'mouse'
  });
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const screenOrientationValueRef = useRef({
    angle: orientation?.angle ?? 0,
    orientationType: orientation?.type
  });
  const deviceOrientationValueRef = useRef({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false
  });
  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };
  useEffect(() => {
    if (!supported) return;
    const publishValue = (nextValue, event) => {
      snapshotRef.current = nextValue;
      if (watchingRef.current) rerender();
      internalOptionsRef.current?.onChange?.(nextValue, event);
    };
    const updateValue = (event) => {
      const element = target ? isTarget.getElement(target) : internalRef.current;
      if (!element) return;
      const { alpha, beta, gamma } = deviceOrientationValueRef.current;
      const hasDeviceOrientation = alpha !== null || beta !== null || gamma !== null;
      if (hasDeviceOrientation) {
        const parallax = getDeviceOrientationParallax(
          beta,
          gamma,
          screenOrientationValueRef.current.orientationType
        );
        if (!parallax) return;
        publishValue(
          {
            source: 'deviceOrientation',
            roll: (internalOptionsRef.current?.deviceOrientationRollAdjust ?? DEFAULT_ADJUST)(
              parallax.roll
            ),
            tilt: (internalOptionsRef.current?.deviceOrientationTiltAdjust ?? DEFAULT_ADJUST)(
              parallax.tilt
            )
          },
          event ?? new Event('deviceorientation')
        );
        return;
      }
      if (!(event instanceof MouseEvent)) return;
      const parallax = getMouseParallax(event, element);
      publishValue(
        {
          source: 'mouse',
          roll: (internalOptionsRef.current?.mouseRollAdjust ?? DEFAULT_ADJUST)(parallax.roll),
          tilt: (internalOptionsRef.current?.mouseTiltAdjust ?? DEFAULT_ADJUST)(parallax.tilt)
        },
        event
      );
    };
    const onMouseMove = (event) => updateValue(event);
    const onDeviceOrientation = (event) => {
      deviceOrientationValueRef.current = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute
      };
      updateValue(event);
    };
    const onOrientationChange = (event) => {
      screenOrientationValueRef.current = {
        angle: window.screen.orientation.angle,
        orientationType: window.screen.orientation.type
      };
      updateValue(event);
    };
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('deviceorientation', onDeviceOrientation);
    window.addEventListener('orientationchange', onOrientationChange);
    updateValue();
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, [supported, internalRef.state, target && isTarget.getRawElement(target)]);
  if (target) return { snapshot: snapshotRef.current, supported, watch };
  return {
    ref: internalRef,
    snapshot: snapshotRef.current,
    supported,
    watch
  };
};
