import { useEffect, useState } from 'react';
/**
 * @name useActiveElement
 * @description - Hook that returns the active element
 * @category Elements
 *
 * @returns {ActiveElement | null} The active element
 *
 * @example
 * const activeElement = useActiveElement();
 */
export const useActiveElement = () => {
    const [activeElement, setActiveElement] = useState(null);
    useEffect(() => {
        const onActiveElementChange = () => setActiveElement(document?.activeElement);
        window.addEventListener('focus', onActiveElementChange, true);
        window.addEventListener('blur', onActiveElementChange, true);
        return () => {
            window.removeEventListener('focus', onActiveElementChange, true);
            window.removeEventListener('blur', onActiveElementChange, true);
        };
    });
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations
                .filter((mutation) => mutation.removedNodes.length)
                .map((mutation) => Array.from(mutation.removedNodes))
                .flat()
                .forEach((node) => {
                setActiveElement((prevActiveElement) => {
                    if (node === prevActiveElement)
                        return document.activeElement;
                    return prevActiveElement;
                });
            });
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        return () => {
            observer.disconnect();
        };
    }, []);
    return activeElement;
};
