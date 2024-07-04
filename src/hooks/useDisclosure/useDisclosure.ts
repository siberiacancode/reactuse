import { useState } from 'react';

interface UseDisclosureOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDisclosureReturn {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * @name useDisclosure
 * @description - Hook that allows you to open and close a modal
 * @category Utilities
 *
 * @param {boolean} initialValue The initial value of the component
 * @param {() => void} [options.onOpen] The callback function to be invoked on open
 * @param {() => void} [options.onClose] The callback function to be invoked on close
 * @returns {UseDisclosureReturn} An object with the opened, open, close, and toggle properties
 *
 * @example
 * const { opened, open, close, toggle } = useDisclosure();
 */
export const useDisclosure = (
  initialValue = false,
  options?: UseDisclosureOptions
): UseDisclosureReturn => {
  const [opened, setOpened] = useState(initialValue);

  const open = () =>
    setOpened((isOpened) => {
      if (!isOpened) {
        options?.onOpen?.();
        return true;
      }
      return isOpened;
    });

  const close = () =>
    setOpened((isOpened) => {
      if (isOpened) {
        options?.onClose?.();
        return false;
      }
      return isOpened;
    });

  const toggle = () => (opened ? close() : open());

  return { opened, open, close, toggle };
};
