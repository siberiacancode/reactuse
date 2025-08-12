import { useEffect, useState } from 'react';

import { useRerender } from '../useRerender/useRerender';

export const getRangesSelection = (selection: Selection) => {
  const rangeCount = selection.rangeCount ?? 0;
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
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
export const useTextSelection = (): UseTextSelectionReturn => {
  const rerender = useRerender();
  const [selection, setSelection] = useState<Selection | null>(
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
