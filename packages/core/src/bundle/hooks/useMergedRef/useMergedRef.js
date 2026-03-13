import { useCallback } from 'react';
export const assignRef = (ref, value) => {
  if (typeof ref === 'function') return ref(value);
  if (typeof ref === 'object' && ref !== null && 'current' in ref) ref.current = value;
};
export const mergeRefs = (...refs) => {
  const cleanupMap = new Map();
  return (node) => {
    refs.forEach((ref) => {
      const cleanup = assignRef(ref, node);
      if (cleanup) cleanupMap.set(ref, cleanup);
    });
    if (!cleanupMap.size) return;
    return () => {
      refs.forEach((ref) => {
        const cleanup = cleanupMap.get(ref);
        if (cleanup && typeof cleanup === 'function') cleanup();
        else assignRef(ref, null);
      });
      cleanupMap.clear();
    };
  };
};
/**
 * @name useMergedRef
 * @description - Hook that merges multiple refs into a single ref
 * @category State
 * @usage medium
 *
 * @template Element The element type
 * @param {...Ref<Element>[]} refs The refs to merge
 * @returns {RefCallback<Element>} A memoized ref callback that assigns to all provided refs
 *
 * @example
 * const mergedRef = useMergedRef(firstRef, secondRef);
 */
export const useMergedRef = (...refs) => useCallback(mergeRefs(...refs), refs);
