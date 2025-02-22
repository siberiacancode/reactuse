import { useState } from 'react';
/**
 * @name useDisclosure
 * @description - Hook that allows you to open and close a modal
 * @category Utilities
 *
 * @param {boolean} [initialValue=false] The initial value of the component
 * @param {() => void} [options.onOpen] The callback function to be invoked on open
 * @param {() => void} [options.onClose] The callback function to be invoked on close
 * @returns {UseDisclosureReturn} An object with the opened, open, close, and toggle properties
 *
 * @example
 * const { opened, open, close, toggle } = useDisclosure();
 */
export const useDisclosure = (initialValue = false, options) => {
    const [opened, setOpened] = useState(initialValue);
    const open = () => setOpened((opened) => {
        if (!opened) {
            options?.onOpen?.();
            return true;
        }
        return opened;
    });
    const close = () => setOpened((opened) => {
        if (opened) {
            options?.onClose?.();
            return false;
        }
        return opened;
    });
    const toggle = () => (opened ? close() : open());
    return { opened, open, close, toggle };
};
