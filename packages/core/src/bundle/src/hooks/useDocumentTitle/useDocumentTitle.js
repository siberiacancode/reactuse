import { useEffect, useRef, useState } from 'react';
/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 * @category Browser
 * @usage low

 * @browserapi document.title https://developer.mozilla.org/en-US/docs/Web/API/Document/title
 *
 * @param {string} [initialValue] The initial title. If not provided, the current document title will be used
 * @param {boolean} [options.restoreOnUnmount] Restore the previous title on unmount
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const { value, set } = useDocumentTitle();
 */
export function useDocumentTitle(initialValue, options) {
  const prevValueRef = useRef(document.title);
  const [value, setValue] = useState(initialValue ?? document.title);
  const set = (value) => {
    const updatedValue = value.trim();
    if (updatedValue.length > 0) document.title = updatedValue;
  };
  useEffect(() => {
    if (typeof value !== 'string') return;
    set(value);
  }, [value]);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setValue((prevValue) => {
        if (document && document.title !== prevValue) {
          return document.title;
        }
        return prevValue;
      });
    });
    observer.observe(document.head.querySelector('title'), {
      childList: true
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (options?.restoreOnUnmount) {
      return () => {
        document.title = prevValueRef.current;
      };
    }
  }, []);
  return { value, set };
}
