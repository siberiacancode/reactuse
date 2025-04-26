import { useState } from 'react';

import { isTarget } from '@/utils/helpers';

import { useRefState } from '../useRefState/useRefState';

/**
 * @name useDropZone
 * @description - Hook that provides drop zone functionality
 * @category Elements
 *
 *
 * @example
 * const {ref, isOverDropZone} = useDropZone({onDrop})
 *
 * @example
 * const { isOverDropZone } = useDropZone(ref, {onDrop});
 */

export const useDropZone = (...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  // const callback = params[1] ? params[1] : params[0];

  const internalRef = useRefState();

  const files = useState<File[] | null>(null);

  if (target)
    return {
      files,
      isOverDropZone: false
    };

  return { ref: internalRef, isOverDropZone: false, files };
};
