import { useEffect, useState } from 'react';
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
export const useVirtualKeyboard = (initialValue = false) => {
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
  const changeOverlaysContent = (overlaysContent) => {
    if (!navigator.virtualKeyboard) return;
    navigator.virtualKeyboard.overlaysContent = overlaysContent;
  };
  useEffect(() => {
    if (!supported) return;
    const onResize = () => setOpened(window.screen.height - 300 > window.visualViewport.height);
    const onGeometryChange = (event) => {
      const { height } = event.target.boundingRect;
      setOpened(height > 0);
    };
    if (navigator.virtualKeyboard) navigator.virtualKeyboard.overlaysContent = true;
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
