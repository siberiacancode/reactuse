import { useEffect, useRef, useState } from 'react';

export const getRangesSelection = (selection: Selection) => {
  const rangeCount = selection.rangeCount ?? 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
};

const getSelectionValue = (selection: Selection | null): UseTextSelectionReturn => {
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

/** The use text selection return type */
export interface UseTextSelectionReturn {
  /** The current selection ranges */
  ranges: Range[];
  /** The current selection rects */
  rects: DOMRect[];
  /** The current selection */
  selection: Selection | null;
  /** The current selection text */
  text: string;
}

export type UseTextSelectionCallback = (value: UseTextSelectionReturn, event: Event) => void;

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
export const useTextSelection = (callback?: UseTextSelectionCallback): UseTextSelectionReturn => {
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const [value, setValue] = useState<UseTextSelectionReturn>(() =>
    getSelectionValue(typeof document !== 'undefined' ? document.getSelection() : null)
  );

  useEffect(() => {
    const onSelectionChange = (event: Event) => {
      const nextValue = getSelectionValue(document.getSelection());
      setValue(nextValue);
      internalCallbackRef.current?.(nextValue, event);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  return value;
};
