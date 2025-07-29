import { useEffect, useRef, useState } from 'react';

/** The use document title options type */
export interface UseDocumentTitleOptions {
  /** Restore the previous title on unmount */
  restoreOnUnmount?: boolean;
}

/** The use document title return type */
export interface UseDocumentTitleReturn {
  /** The current title */
  value: string;
  /** Function to update the title */
  set: (title: string) => void;
}

/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 * @category Browser
 *
 * @browserapi document.title https://developer.mozilla.org/en-US/docs/Web/API/Document/title
 *
 * @param {string} [initialValue] The initial title. If not provided, the current document title will be used
 * @param {boolean} [options.restoreOnUnmount] Restore the previous title on unmount
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const { value, set } = useDocumentTitle();
 */
export function useDocumentTitle(
  initialValue?: string,
  options?: UseDocumentTitleOptions
): UseDocumentTitleReturn {
  const prevValueRef = useRef(document.title);
  const [value, setValue] = useState(initialValue ?? document.title);

  const set = (value: string) => {
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

    observer.observe(document.head.querySelector('title')!, {
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
