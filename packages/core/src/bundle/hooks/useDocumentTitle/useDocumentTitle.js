import { useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 * @category Browser
 *
 * @param {string} [value] The initial title. If not provided, the current document title will be used
 * @param {boolean} [options.restoreOnUnmount] Restore the previous title on unmount
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const [title, setTitle] = useDocumentTitle();
 */
export function useDocumentTitle(value, options) {
    const prevTitleRef = useRef(document.title);
    const [title, setTitle] = useState(value ?? document.title);
    const set = (value) => {
        const updatedValue = value.trim();
        if (updatedValue.length > 0)
            document.title = updatedValue;
    };
    useIsomorphicLayoutEffect(() => {
        if (typeof value !== 'string')
            return;
        set(value);
    }, [value]);
    useIsomorphicLayoutEffect(() => {
        const observer = new MutationObserver(() => {
            setTitle((prevTitle) => {
                if (document && document.title !== prevTitle) {
                    return document.title;
                }
                return prevTitle;
            });
        });
        observer.observe(document.head.querySelector('title'), { childList: true });
        return () => {
            observer.disconnect();
        };
    }, []);
    useEffect(() => {
        if (options?.restoreOnUnmount) {
            return () => {
                document.title = prevTitleRef.current;
            };
        }
    }, []);
    return [title, set];
}
