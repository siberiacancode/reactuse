import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

type DragEventType = 'drop' | 'enter' | 'leave' | 'over';

export interface UseDropZoneOptions {
  dataTypes?: ((types: string[]) => boolean) | string[];
  multiple?: boolean;
  onDrop?: (files: File[] | null, event: DragEvent) => void;
  onEnter?: (files: File[] | null, event: DragEvent) => void;
  onLeave?: (files: File[] | null, event: DragEvent) => void;
  onOver?: (files: File[] | null, event: DragEvent) => void;
}

interface UseDropZoneReturn {
  files: File[] | null;
  isOver: boolean;
}

export interface UseDropZone {
  (
    target: HookTarget,
    callback?: (files: File[] | null, event: DragEvent) => void
  ): UseDropZoneReturn;

  <Target extends Element>(
    callback?: (files: File[] | null, event: DragEvent) => void,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };

  (target: HookTarget, options?: UseDropZoneOptions): UseDropZoneReturn;

  <Target extends Element>(
    options?: UseDropZoneOptions,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };
}

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

export const useDropZone = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onDrop: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onDrop: params[0] }
  ) as UseDropZoneOptions;

  const internalRef = useRefState<Element>();

  const [files, setFiles] = useState<File[] | null>(null);
  const [isOver, setIsOver] = useState<boolean>(false);

  const getFiles = (event: DragEvent) => {
    const list = Array.from(event.dataTransfer?.files ?? []);
    return list.length === 0 ? null : options.multiple ? list : [list[0]];
  };

  const checkDataTypes = (types: string[]) => {
    const dataTypes = options.dataTypes;

    if (typeof dataTypes === 'function') return dataTypes(types);

    if (!dataTypes?.length) return true;

    if (types.length === 0) return false;

    return types.every((type) => dataTypes?.some((dataType) => type.includes(dataType)));
  };

  const checkValidity = (items: DataTransferItemList) => {
    const types = Array.from(items ?? []).map((item) => item.type);

    const dataTypesValid = checkDataTypes(types);
    const multipleFilesValid = options.multiple || items.length <= 1;

    return dataTypesValid && multipleFilesValid;
  };

  const handleDragEvent = (event: DragEvent, eventType: DragEventType) => {
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

    const handleDrop = ((event: DragEvent) => handleDragEvent(event, 'drop')) as EventListener;

    const handleDragOver = ((event: DragEvent) => handleDragEvent(event, 'over')) as EventListener;

    const handleDragEnter = ((event: DragEvent) =>
      handleDragEvent(event, 'enter')) as EventListener;

    const handleDragLeave = ((event: DragEvent) =>
      handleDragEvent(event, 'leave')) as EventListener;

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
}) as UseDropZone;
