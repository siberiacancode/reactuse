import { useEffect, useState } from 'react';
import { useRerender } from '../useRerender/useRerender';
export const getRangesSelection = (selection) => {
  const rangeCount = selection.rangeCount ?? 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
};
/**
 * @name useTextSelection
 * @description - Hook that manages the text selection
 * @category Sensors
 * @usage low
 *
 * @browserapi document.getSelection https://developer.mozilla.org/en-US/docs/Web/API/Document/getSelection
 *
 * @returns {UseTextSelectionReturn} An object containing the current text selection
 *
 * @example
 * const selection = useTextSelection();
 */
export const useTextSelection = () => {
  const rerender = useRerender();
  const [selection, setSelection] = useState(
    typeof document !== 'undefined' ? document.getSelection() : null
  );
  useEffect(() => {
    const onSelectionChange = () => {
      setSelection(document.getSelection());
      rerender();
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);
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
