import { useEffect, useRef, useState } from 'react';
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
export const useDropZone = (options) => {
  const target = useRef(null);
  const [files, setFiles] = useState(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const getFiles = (event) => {
    const list = Array.from(event.dataTransfer?.files ?? []);
    return list.length === 0 ? null : options.multiple ? list : [list[0]];
  };
  const handleDragEvent = (event, eventType) => {
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
    const handleDrop = (event) => handleDragEvent(event, 'drop');
    const handleDragOver = (event) => handleDragEvent(event, 'over');
    const handleDragEnter = (event) => handleDragEvent(event, 'enter');
    const handleDragLeave = (event) => handleDragEvent(event, 'leave');
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
