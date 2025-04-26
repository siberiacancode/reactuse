import type { Ref } from 'react';

import { useEffect, useRef, useState } from 'react';

type EventType = 'drop' | 'enter' | 'leave' | 'over';

interface UseDropZoneOptions {
  dataTypes?: ((types: readonly string[]) => boolean) | Ref<readonly string[]>;
  multiple?: boolean;
  preventDefaultForUnhandled?: boolean;
  onDrop?: (files: File[] | null, event: DragEvent) => void;
  onEnter?: (files: File[] | null, event: DragEvent) => void;
  onLeave?: (files: File[] | null, event: DragEvent) => void;
  onOver?: (files: File[] | null, event: DragEvent) => void;
}

export interface UseDropZoneReturn {
  files: File[] | null;
  isOverDropZone: boolean;
}

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

export const useDropZone = (options: UseDropZoneOptions) => {
  const target = useRef<any>(null);

  const [files, setFiles] = useState<File[] | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState<boolean>(false);

  const getFiles = (event: DragEvent) => {
    const list = Array.from(event.dataTransfer?.files ?? []);
    return list.length === 0 ? null : options.multiple ? list : [list[0]];
  };

  const handleDragEvent = (event: DragEvent, eventType: EventType) => {
    event.preventDefault();

    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';

    const currentFiles = getFiles(event);

    if (eventType === 'drop') {
      setIsOverDropZone(false);
      options.onDrop?.(currentFiles, event);

      return;
    }

    if (eventType === 'enter') {
      setIsOverDropZone(true);
      setFiles(currentFiles);
      options.onEnter?.(null, event);

      return;
    }

    if (eventType === 'leave') {
      setIsOverDropZone(false);
      options.onLeave?.(null, event);

      return;
    }

    if (eventType === 'over') options.onOver?.(null, event);
  };

  useEffect(() => {
    if (!target.current) return;

    const handleDrop = (event: DragEvent) => handleDragEvent(event, 'drop');

    const handleDragOver = (event: DragEvent) => handleDragEvent(event, 'over');

    const handleDragEnter = (event: DragEvent) => handleDragEvent(event, 'enter');

    const handleDragLeave = (event: DragEvent) => handleDragEvent(event, 'leave');

    target.current.addEventListener('dragenter', handleDragEnter);
    target.current.addEventListener('dragover', handleDragOver);
    target.current.addEventListener('dragleave', handleDragLeave);
    target.current.addEventListener('drop', handleDrop);

    return () => {
      target.current.removeEventListener('dragenter', handleDragEnter);
      target.current.removeEventListener('dragover', handleDragOver);
      target.current.removeEventListener('dragleave', handleDragLeave);
      target.current.removeEventListener('drop', handleDrop);
    };
  }, [target]);

  return { ref: target, isOverDropZone, files };
};
