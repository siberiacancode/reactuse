import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useDropZone
 * @description - Hook that provides drop zone functionality
 * @category Elements
 * @usage medium

 * @overload
 * @template Target The target element
 * @param {Target} target The target element drop zone's
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {UseDropZoneReturn} The object with drop zone states
 *
 * @example
 * const { overed, files } = useDropZone(ref, options);
 *
 * @overload
 * @param {Target} target The target element drop zone's
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {UseDropZoneReturn} The object with drop zone states
 *
 * @example
 * const { overed, files } = useDropZone(ref, () => console.log('callback'));
 *
 * @overload
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {UseDropZoneReturn & { ref: StateRef<Target> }} The object with drop zone states and ref
 *
 * @example
 * const { ref, overed, files } = useDropZone(options);
 *
 * @overload
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {UseDropZoneReturn & { ref: StateRef<Target> }} The object with drop zone states and ref
 *
 * @example
 * const { ref, overed, files } = useDropZone(() => console.log('callback'));
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
  const counterRef = useRef(0);
  const [files, setFiles] = useState(null);
  const [overed, setOvered] = useState(false);
  const dataTypes = options.dataTypes;
  const getFiles = (event) => {
    if (!event.dataTransfer) return null;
    const list = Array.from(event.dataTransfer.files);
    if (options.multiple) return list;
    if (!list.length) return null;
    return [list[0]];
  };
  const checkDataTypes = (types) => {
    if (!dataTypes) return true;
    if (typeof dataTypes === 'function') return dataTypes(types);
    if (!dataTypes.length) return true;
    if (!types.length) return false;
    return types.every((type) => dataTypes.some((dataType) => type.includes(dataType)));
  };
  const checkValidity = (items) => {
    const types = Array.from(items).map((item) => item.type);
    const dataTypesValid = checkDataTypes(types);
    const multipleFilesValid = options.multiple || items.length <= 1;
    return dataTypesValid && multipleFilesValid;
  };
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const onEvent = (event, type) => {
      if (!event.dataTransfer) return;
      const isValid = checkValidity(event.dataTransfer.items);
      if (!isValid) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      const currentFiles = getFiles(event);
      if (type === 'drop') {
        counterRef.current = 0;
        setOvered(false);
        setFiles(currentFiles);
        options.onDrop?.(currentFiles, event);
        return;
      }
      if (type === 'enter') {
        counterRef.current += 1;
        setOvered(true);
        options.onEnter?.(event);
        return;
      }
      if (type === 'leave') {
        counterRef.current -= 1;
        if (counterRef.current !== 0) return;
        setOvered(false);
        options.onLeave?.(event);
        return;
      }
      if (type === 'over') options.onOver?.(event);
    };
    const onDrop = (event) => onEvent(event, 'drop');
    const onDragOver = (event) => onEvent(event, 'over');
    const onDragEnter = (event) => onEvent(event, 'enter');
    const onDragLeave = (event) => onEvent(event, 'leave');
    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('drop', onDrop);
    return () => {
      element.removeEventListener('dragenter', onDragEnter);
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('dragleave', onDragLeave);
      element.removeEventListener('drop', onDrop);
    };
  }, [target, internalRef.current]);
  if (target) return { overed, files };
  return { ref: internalRef, overed, files };
};
