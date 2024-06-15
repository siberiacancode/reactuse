import React from 'react';

type UseSwipeTarget = React.RefObject<Element | null> | (() => Element) | Element;
export type UseSwipeDirection = 'up' | 'down' | 'left' | 'right' | 'none';
export type UseSwipeHandledEvents = React.MouseEvent | TouchEvent | MouseEvent;
export type UseSwipeCallback = (value: UseSwipeReturn) => void;
export type UseSwipePosition = { x: number; y: number };

export type UseSwipeReturn = {
  direction: UseSwipeDirection;
  isSwiping: boolean;
  deltaX: number;
  deltaY: number;
  percent: number;
  coordsStart: UseSwipePosition;
  coordsEnd: UseSwipePosition;
};

export type UseSwipeReturnActions = {
  reset: () => void;
};

export type UseSwipeActions = {
  onSwipeStart?: UseSwipeCallback;
  onSwiping?: UseSwipeCallback;
  onSwiped?: UseSwipeCallback;
  onSwipedLeft?: UseSwipeCallback;
  onSwipedRight?: UseSwipeCallback;
  onSwipedUp?: UseSwipeCallback;
  onSwipedDown?: UseSwipeCallback;
};

export type UseSwipeOptions = {
  /** Min distance(px) before a swipe starts. **Default**: `10` */
  threshold: number;
  /** Prevents scroll during swipe in most cases. **Default**: `false` */
  preventScrollOnSwipe: boolean;
  /** Track mouse input. **Default**: `true` */
  trackMouse: boolean;
  /** Track touch input. **Default**: `true` */
  trackTouch: boolean;
} & UseSwipeActions;

export type UseSwipe = {
  <Target extends UseSwipeTarget>(
    target: Target,
    options?: Partial<UseSwipeOptions>
  ): UseSwipeReturn & UseSwipeReturnActions;

  <Target extends UseSwipeTarget>(
    options?: Partial<UseSwipeOptions>,
    target?: never
  ): UseSwipeReturn & { ref: React.RefObject<Target> } & UseSwipeReturnActions;
};

const USE_SWIPE_DEFAULT_OPTIONS: UseSwipeOptions = {
  threshold: 10,
  preventScrollOnSwipe: false,
  trackMouse: true,
  trackTouch: true
};

const USE_SWIPE_DEFAULT_STATE: UseSwipeReturn = {
  isSwiping: false,
  direction: 'none',
  coordsStart: { x: 0, y: 0 },
  coordsEnd: { x: 0, y: 0 },
  deltaX: 0,
  deltaY: 0,
  percent: 0
};

const getElement = (target: UseSwipeTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

const getUseSwipeOptions = (options: UseSwipeOptions) => {
  return {
    ...USE_SWIPE_DEFAULT_OPTIONS,
    ...options
  };
};

const getSwipeDirection = (deltaX: number, deltaY: number): UseSwipeDirection => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'left' : 'right';
  }
  return deltaY > 0 ? 'up' : 'down';
};

export const useSwipe = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseSwipeTarget
    | undefined;
  const userOptions = (target ? params[1] : params[0]) as UseSwipeOptions;

  const options = getUseSwipeOptions(userOptions);
  const internalRef = React.useRef<Element>(null);

  const [value, setValue] = React.useState<UseSwipeReturn>(USE_SWIPE_DEFAULT_STATE);

  const reset = () => {
    setValue({ ...USE_SWIPE_DEFAULT_STATE });
  };

  // looks bullshit need some rework
  const getSwipePositions = (event: UseSwipeHandledEvents) => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return { x: 0, y: 0 }; // ?

    const isTouch = 'touches' in event;
    const { clientX, clientY } = isTouch ? event.touches[0] : event;
    const boundingRect = element.getBoundingClientRect();
    const x = Math.round(clientX - boundingRect.left);
    const y = Math.round(clientY - boundingRect.top);
    return { x, y };
  };

  const getPercent = (deltaX: number, deltaY: number): Record<UseSwipeDirection, number> => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return { none: 0, down: 0, left: 0, right: 0, up: 0 }; // ?
    const { width, height } = element.getBoundingClientRect();
    return {
      none: 0,
      left: Math.round((Math.abs(deltaX) * 100) / width),
      right: Math.round((Math.abs(deltaX) * 100) / width),
      up: Math.round((Math.abs(deltaY) * 100) / height),
      down: Math.round((Math.abs(deltaY) * 100) / height)
    };
  };

  const onMove = (event: UseSwipeHandledEvents) => {
    setValue((prevValue) => {
      if (options.preventScrollOnSwipe) {
        event.preventDefault();
        event.stopPropagation();
      }

      const { x, y } = getSwipePositions(event);
      const deltaX = Math.round(prevValue.coordsStart.x - x);
      const deltaY = Math.round(prevValue.coordsStart.y - y);
      const isThresholdExceeded = Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= options.threshold;
      const isSwiping = prevValue.isSwiping || isThresholdExceeded;
      const direction = isSwiping ? getSwipeDirection(deltaX, deltaY) : 'none';
      const percent = getPercent(deltaX, deltaY);
      const newValue: UseSwipeReturn = {
        ...prevValue,
        isSwiping,
        direction,
        coordsEnd: { x, y },
        deltaX,
        deltaY,
        percent: percent[direction]
      };

      options?.onSwiping?.(newValue);
      return newValue;
    });
  };

  const onFinish = () => {
    setValue((prevValue) => {
      const newValue: UseSwipeReturn = {
        ...prevValue,
        isSwiping: false
      };

      options?.onSwiped?.(newValue);

      const directionCallbacks = {
        left: options.onSwipedLeft,
        right: options.onSwipedRight,
        up: options.onSwipedUp,
        down: options.onSwipedDown
      };

      if (newValue.direction === 'none') return newValue;

      const callback = directionCallbacks[newValue.direction];
      callback?.(newValue);

      return newValue;
    });

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
  };
  const onStart = (event: UseSwipeHandledEvents) => {
    event.preventDefault(); // prevent text selection

    const isTouch = 'touches' in event;
    if (options.trackMouse && !isTouch) {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onFinish, { once: true });
    }
    if (options.trackTouch && isTouch) {
      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onFinish, { once: true });
    }

    const { x, y } = getSwipePositions(event);

    setValue((prevValue) => {
      const newValue: UseSwipeReturn = {
        ...prevValue,
        coordsStart: { x, y },
        direction: 'none'
      };
      options?.onSwipeStart?.(newValue);
      return newValue;
    });
  };

  React.useEffect(() => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    // @ts-ignore
    // element.addEventListener('mousedown', (event) <-- has Event type, not MouseEvent
    if (options.trackMouse) element.addEventListener('mousedown', onStart);
    // @ts-ignore
    if (options.trackTouch) element.addEventListener('touchstart', onStart);

    return () => {
      // @ts-ignore
      element.removeEventListener('mousedown', onStart);
      // @ts-ignore
      element.removeEventListener('touchstart', onStart);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onFinish);
      document.removeEventListener('touchend', onFinish);
    };
  }, []);

  if (target) return { ...value, reset };
  return { ...value, reset, ref: internalRef };
}) as UseSwipe;
