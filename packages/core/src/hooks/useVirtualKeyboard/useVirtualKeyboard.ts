import { useEffect, useState } from 'react';

declare global {
  interface Navigator {
    virtualKeyboard?: {
      boundingRect: DOMRect;
      overlaysContent: boolean;
      show: () => void;
      hide: () => void;
      addEventListener: (type: 'geometrychange', listener: EventListener) => void;
      removeEventListener: (type: 'geometrychange', listener: EventListener) => void;
    };
  }
}

/** The use virtual keyboard return type */
export interface UseVirtualKeyboardReturn {
  /** Whether the virtual keyboard is currently open */
  opened: boolean;
  /** Whether the VirtualKeyboard API is supported */
  supported: boolean;
  /** Change the overlays content */
  changeOverlaysContent: (overlaysContent: boolean) => void;
  /** Hide the virtual keyboard */
  hide: () => void;
  /** Show the virtual keyboard */
  show: () => void;
}

/**
 * @name useVirtualKeyboard
 * @description - Hook that manages virtual keyboard state
 * @category Browser
 *
 * @browserapi VirtualKeyboard https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard
 *
 * @warning - This hook has a fallback for virtual keyboard detection. If the virtual keyboard is not supported, the methods will not work.
 *
 * @param {boolean} [initialValue=false] The initial state value for keyboard visibility
 * @returns {UseVirtualKeyboardReturn} An object containing keyboard state and control methods
 *
 * @example
 * const { opened, show, hide, supported, changeOverlaysContent } = useVirtualKeyboard();
 */
export const useVirtualKeyboard = (initialValue = false): UseVirtualKeyboardReturn => {
  const supported =
    (typeof window !== 'undefined' && 'visualViewport' in window) ||
    (typeof navigator !== 'undefined' && 'virtualKeyboard' in navigator);

  const [opened, setOpened] = useState(initialValue);

  const hide = () => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.hide();
    setOpened(false);
  };

  const show = () => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.show();
    setOpened(true);
  };

  const changeOverlaysContent = (overlaysContent: boolean) => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.overlaysContent = overlaysContent;
  };

  useEffect(() => {
    if (!supported) return;

    const onResize = () => setOpened(window.screen.height - 300 > window.visualViewport!.height);

    const onGeometryChange = (event: Event) => {
      const { height } = (event.target as any).boundingRect as DOMRect;
      setOpened(height > 0);
    };

    navigator.virtualKeyboard &&
      navigator.virtualKeyboard.addEventListener('geometrychange', onGeometryChange);
    window.visualViewport && window.visualViewport.addEventListener('resize', onResize);

    return () => {
      navigator.virtualKeyboard &&
        navigator.virtualKeyboard.removeEventListener('geometrychange', onGeometryChange);
      window.visualViewport && window.visualViewport.removeEventListener('resize', onResize);
    };
  }, []);

  return {
    opened,
    show,
    hide,
    changeOverlaysContent,
    supported
  };
};
