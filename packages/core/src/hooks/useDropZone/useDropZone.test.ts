import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseDropZoneReturn } from './useDropZone';

import { useDropZone } from './useDropZone';

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') },
  Object.assign(() => {}, {
    state: document.getElementById('target'),
    current: document.getElementById('target')
  })
];

const element = document.getElementById('target') as HTMLDivElement;

const createDragEvent = (
  type: 'dragenter' | 'dragleave' | 'dragover' | 'drop',
  files: File[] = [],
  types: string[] = []
): DragEvent => {
  const event = new Event(type) as DragEvent;

  const fileList = Object.assign(files, {
    item: (index: number) => files[index] ?? null,
    length: files.length
  });

  const items = types.map((type) => ({
    kind: 'file' as const,
    type,
    getAsFile: () => null,
    getAsString: () => {}
  }));

  const itemList = Object.assign(items, {
    length: types.length,
    item: (index: number) => items[index] || null,
    add: vi.fn(),
    clear: vi.fn(),
    remove: vi.fn()
  }) as unknown as DataTransferItemList;

  const dataTransfer = {
    files: fileList,
    items: itemList,
    dropEffect: 'none' as DataTransfer['dropEffect'],
    effectAllowed: 'all' as DataTransfer['effectAllowed']
  };

  Object.defineProperty(event, 'dataTransfer', {
    value: dataTransfer,
    enumerable: true,
    configurable: true
  });

  return event;
};

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use drop zone', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.files).toBeNull();
      expect(result.current.overed).toBeFalsy();
    });

    it('Should use drop zone on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useDropZone(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.files).toBeNull();
      expect(result.current.overed).toBeFalsy();
    });

    it('Should handle drop event with callback', () => {
      const callback = vi.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      const dropEvent = createDragEvent('drop', [file], [file.type]);
      act(() => element.dispatchEvent(dropEvent));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([file], dropEvent);
    });

    it('Should handle drag enter event', () => {
      const onEnter = vi.fn();
      const file = new File(['content'], 'file.txt', { type: 'text/plain' });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, { onEnter }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({ onEnter });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.overed).toBeFalsy();

      const dragEvent = createDragEvent('dragenter', [file], [file.type]);
      act(() => element.dispatchEvent(dragEvent));

      expect(result.current.overed).toBeTruthy();

      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(onEnter).toHaveBeenCalledWith(dragEvent);
    });

    it('Should handle drag leave event', () => {
      const onLeave = vi.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, { onLeave }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({ onLeave });
      });

      if (!target) act(() => result.current.ref(element));

      const enterEvent = createDragEvent('dragenter', [file], [file.type]);
      act(() => element.dispatchEvent(enterEvent));

      expect(result.current.overed).toBeTruthy();

      const leaveEvent = createDragEvent('dragleave', [file], [file.type]);
      act(() => element.dispatchEvent(leaveEvent));

      expect(result.current.overed).toBeFalsy();

      expect(onLeave).toHaveBeenCalledTimes(1);
      expect(onLeave).toHaveBeenCalledWith(leaveEvent);
    });

    it('Should handle drag over event', () => {
      const onOver = vi.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, { onOver }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({ onOver });
      });

      if (!target) act(() => result.current.ref(element));

      const overEvent = createDragEvent('dragover', [file], [file.type]);
      act(() => element.dispatchEvent(overEvent));

      expect(onOver).toHaveBeenCalledTimes(1);
      expect(onOver).toHaveBeenCalledWith(overEvent);
    });

    it('Should handle drop event', () => {
      const onDrop = vi.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, { onDrop }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({ onDrop });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.files).toBeNull();

      const dropEvent = createDragEvent('drop', [file, file], [file.type]);
      act(() => element.dispatchEvent(dropEvent));

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files![0].name).toBe('test.txt');
      expect(result.current.overed).toBeFalsy();

      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith([file], dropEvent);
    });

    it('Should handle multiple files', () => {
      const onDrop = vi.fn();
      const file = new File(['content'], 'file.txt', {
        type: 'text/plain'
      });

      const { result } = renderHook(() => {
        if (target)
          return useDropZone(target, { onDrop, multiple: true }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({ onDrop, multiple: true });
      });

      if (!target) act(() => result.current.ref(element));

      const dropEvent = createDragEvent('drop', [file, file], [file.type, file.type]);
      act(() => element.dispatchEvent(dropEvent));

      expect(result.current.files).toHaveLength(2);
      expect(onDrop).toHaveBeenCalledWith([file, file], dropEvent);
    });

    it('Should filter files by dataTypes array', () => {
      const onEnter = vi.fn();

      const textFile = new File(['content'], 'file.txt', {
        type: 'text/plain'
      });
      const jpgFile = new File(['content'], 'file.jpg', {
        type: 'image/jpeg'
      });

      const { result } = renderHook(() => {
        const dataTypes = ['image'];
        if (target)
          return useDropZone(target, {
            onEnter,
            dataTypes
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({
          onEnter,
          dataTypes
        });
      });

      if (!target) act(() => result.current.ref(element));

      const invalidEvent = createDragEvent('dragenter', [textFile], [textFile.type]);
      act(() => element.dispatchEvent(invalidEvent));

      expect(result.current.overed).toBeFalsy();
      expect(onEnter).not.toHaveBeenCalled();
      expect(invalidEvent.dataTransfer!.dropEffect).toBe('none');

      const validEvent = createDragEvent('dragenter', [jpgFile], [jpgFile.type]);
      act(() => element.dispatchEvent(validEvent));

      expect(result.current.overed).toBeTruthy();
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(validEvent.dataTransfer!.dropEffect).toBe('copy');
    });

    it('Should filter files by dataTypes function', () => {
      const onEnter = vi.fn();

      const textFile = new File(['content'], 'file.txt', {
        type: 'text/plain'
      });
      const jpgFile = new File(['content'], 'file.jpg', {
        type: 'image/jpeg'
      });

      const { result } = renderHook(() => {
        const dataTypes = (types: string[]) => {
          console.log('@types', types, types.includes('text/plain'));
          return types.includes('text/plain');
        };

        if (target)
          return useDropZone(target, {
            onEnter,
            dataTypes
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>({
          onEnter,
          dataTypes
        });
      });

      if (!target) act(() => result.current.ref(element));

      const invalidEvent = createDragEvent('dragenter', [jpgFile], [jpgFile.type]);
      act(() => element.dispatchEvent(invalidEvent));

      expect(result.current.overed).toBeFalsy();
      expect(onEnter).not.toHaveBeenCalled();
      expect(invalidEvent.dataTransfer!.dropEffect).toBe('none');

      const validEvent = createDragEvent('dragenter', [textFile], [textFile.type]);
      act(() => element.dispatchEvent(validEvent));

      expect(result.current.overed).toBeTruthy();
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(validEvent.dataTransfer!.dropEffect).toBe('copy');
    });

    it('Should handle target changes', () => {
      const onDrop = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useDropZone(target, { onDrop }) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseDropZoneReturn;
          return useDropZone<HTMLDivElement>({ onDrop });
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(8);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(4);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useDropZone(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDropZoneReturn;
        return useDropZone<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('dragenter', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('dragleave', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('drop', expect.any(Function));
    });
  });
});
