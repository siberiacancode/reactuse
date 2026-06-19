import { useEffect, useRef, useState } from 'react';
export const getRangesSelection = (selection) => {
  const rangeCount = selection.rangeCount ?? 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
};
const getSelectionValue = (selection) => {
  const text = selection?.toString() ?? '';
  const ranges = selection ? getRangesSelection(selection) : [];
  const rects = ranges.map((range) => range.getBoundingClientRect());
  return {
    text,
    ranges,
    rects,
    selection
  };
};
/**
 * @name useTextSelection
 * @description - Hook that manages the text selection
 * @category Sensors
 * @usage low
 *
 * @browserapi document.getSelection https://developer.mozilla.org/en-US/docs/Web/API/Document/getSelection
 *
 * @param {(value: UseTextSelectionReturn, event: Event) => void} [callback] The callback to invoke on selection updates
 * @returns {UseTextSelectionReturn} An object containing the current text selection
 *
 * @example
 * const selection = useTextSelection();
 */
export const useTextSelection = (callback) => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const [value, setValue] = useState(() =>
    getSelectionValue(typeof document !== 'undefined' ? document.getSelection() : null)
  );
  useEffect(() => {
    const onSelectionChange = (event) => {
      const nextValue = getSelectionValue(document.getSelection());
      setValue(nextValue);
      internalCallbackRef.current?.(nextValue, event);
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);
  return value;
};
