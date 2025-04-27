import { useEffect, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useDropZone
 * @description - Hook that provides drop zone functionality
 * @category Elements
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element drop zone's
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {[boolean, File[] | null]} The object with drop zone states
 *
 * @example
 * const {isOver, files} = useDropZone(ref, options);
 *
 * @overload
 * @param {Target} target The target element drop zone's
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {[boolean, File[] | null]} The object with drop zone states
 *
 * @example
 * const {isOver, files} = useDropZone(ref, () => console.log('callback'));
 *
 * @overload
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {[StateRef<Target>, boolean, File[] | null]} The object with drop zone states and ref
 *
 * @example
 * const { ref, isOver, files } = useDropZone(options);
 *
 * @overload
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {[StateRef<Target>, boolean, File[] | null]} The object with drop zone states and ref
 *
 * @example
 * const { ref, isOver, files } = useDropZone(() => console.log('callback'));
 */
export const useDropZone = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onDrop: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onDrop: params[0] };
  const internalRef = useRefState();
  const [files, setFiles] = useState(null);
  const [isOver, setIsOver] = useState(false);
  const getFiles = (event) => {
    const list = Array.from(event.dataTransfer?.files ?? []);
    return list.length === 0 ? null : options.multiple ? list : [list[0]];
  };
  const checkDataTypes = (types) => {
    const dataTypes = options.dataTypes;
    if (typeof dataTypes === 'function') return dataTypes(types);
    if (!dataTypes?.length) return true;
    if (types.length === 0) return false;
    return types.every((type) => dataTypes?.some((dataType) => type.includes(dataType)));
  };
  const checkValidity = (items) => {
    const types = Array.from(items ?? []).map((item) => item.type);
    const dataTypesValid = checkDataTypes(types);
    const multipleFilesValid = options.multiple || items.length <= 1;
    return dataTypesValid && multipleFilesValid;
  };
  const handleDragEvent = (event, eventType) => {
    const dataTransferItemList = event.dataTransfer?.items;
    const isValid = (dataTransferItemList && checkValidity(dataTransferItemList)) ?? false;
    if (!isValid) {
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    const currentFiles = getFiles(event);
    if (eventType === 'drop') {
      setIsOver(false);
      setFiles(currentFiles);
      options.onDrop?.(currentFiles, event);
      return;
    }
    if (eventType === 'enter') {
      setIsOver(true);
      options.onEnter?.(null, event);
      return;
    }
    if (eventType === 'leave') {
      setIsOver(false);
      options.onLeave?.(null, event);
      return;
    }
    if (eventType === 'over') options.onOver?.(null, event);
  };
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const handleDrop = (event) => handleDragEvent(event, 'drop');
    const handleDragOver = (event) => handleDragEvent(event, 'over');
    const handleDragEnter = (event) => handleDragEvent(event, 'enter');
    const handleDragLeave = (event) => handleDragEvent(event, 'leave');
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    return () => {
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [target, internalRef.current]);
  if (target) return { isOver, files };
  return { ref: internalRef, isOver, files };
};
