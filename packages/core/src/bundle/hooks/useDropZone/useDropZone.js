import { useEffect, useRef, useState } from 'react';
/**
 * @name useDropZone
 * @description - Hook that provides drop zone functionality
 * @category Elements
 *
 *
 * @example
 * const {ref, isOver} = useDropZone({onDrop})
 *
 * @example
 * const { isOver } = useDropZone(ref, {onDrop});
 */
// TODO: сделать два вида получения рефа из хука и принимать из вне
// TODO: сделать доп валидации и мультиплай файлов
export const useDropZone = (options) => {
  const target = useRef(null);
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
      options.onDrop?.(currentFiles, event);
      return;
    }
    if (eventType === 'enter') {
      setIsOver(true);
      setFiles(currentFiles);
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
  return { ref: target, isOver, files };
};
