import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

interface InternalDeviceOrientationValue {
  absolute: boolean;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface InternalScreenOrientationValue {
  angle: number;
  orientationType?: OrientationType;
}

/** The use parallax value type */
export interface UseParallaxValue {
  /** Roll value. Scaled to `-0.5 ~ 0.5` */
  roll: number;
  /** Sensor source, can be `mouse` or `deviceOrientation` */
  source: 'deviceOrientation' | 'mouse';
  /** Tilt value. Scaled to `-0.5 ~ 0.5` */
  tilt: number;
}

export type UseParallaxCallback = (value: UseParallaxValue, event: Event) => void;

/** The use parallax options type */
export interface UseParallaxOptions {
  /** Callback invoked on parallax updates */
  onChange?: UseParallaxCallback;
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
  snapshot: UseParallaxValue;
  supported: boolean;
  watch: () => UseParallaxValue;
}

export interface UseParallax {
  (target: HookTarget, callback?: UseParallaxCallback): UseParallaxReturn;

  (target: HookTarget, options?: UseParallaxOptions): UseParallaxReturn;

  <Target extends Element>(
    callback?: UseParallaxCallback,
    target?: never
  ): UseParallaxReturn & {
    ref: StateRef<Target>;
  };

  <Target extends Element>(
    options?: UseParallaxOptions,
    target?: never
  ): UseParallaxReturn & {
    ref: StateRef<Target>;
  };
}

const DEFAULT_ADJUST = (value: number) => value;

export const getDeviceOrientationParallax = (
  beta: number | null,
  gamma: number | null,
  orientationType?: OrientationType
): { roll: number; tilt: number } | null => {
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

export const getMouseParallax = (
  event: MouseEvent,
  element: Element
): { roll: number; tilt: number } => {
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
export const useParallax = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'function'
        ? { ...params[2], onChange: params[1] }
        : params[1]
      : typeof params[0] === 'function'
        ? { ...params[1], onChange: params[0] }
        : params[0]
  ) as UseParallaxOptions | undefined;

  const supported =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    'DeviceOrientationEvent' in window &&
    !!window.DeviceOrientationEvent &&
    'screen' in window &&
    'orientation' in window.screen &&
    !!window.screen.orientation;

  const orientation = supported ? window.screen.orientation : undefined;

  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const snapshotRef = useRef<UseParallaxValue>({
    roll: 0,
    tilt: 0,
    source: 'mouse'
  });
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const screenOrientationValueRef = useRef<InternalScreenOrientationValue>({
    angle: orientation?.angle ?? 0,
    orientationType: orientation?.type
  });
  const deviceOrientationValueRef = useRef<InternalDeviceOrientationValue>({
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

    const publishValue = (nextValue: UseParallaxValue, event: Event) => {
      snapshotRef.current = nextValue;
      if (watchingRef.current) rerender();
      internalOptionsRef.current?.onChange?.(nextValue, event);
    };

    const updateValue = (event?: Event) => {
      const element = (target ? isTarget.getElement(target) : internalRef.current) as
        | Element
        | undefined;

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

    const onMouseMove = (event: MouseEvent) => updateValue(event);

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      deviceOrientationValueRef.current = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute
      };

      updateValue(event);
    };

    const onOrientationChange = (event: Event) => {
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
}) as UseParallax;
