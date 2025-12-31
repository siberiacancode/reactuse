import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useTextSelection } from './useTextSelection';

it('Should use text selection', () => {
  const { result } = renderHook(useTextSelection);

  expect(result.current.text).toBe('');
  expect(result.current.ranges).toEqual([]);
  expect(result.current.rects).toEqual([]);
  expect(result.current.selection).toBe(document.getSelection());
});

it('Should use text selection on server side', () => {
  const { result } = renderHookServer(useTextSelection);

  expect(result.current.text).toBe('');
  expect(result.current.ranges).toEqual([]);
  expect(result.current.rects).toEqual([]);
  expect(result.current.selection).toBeNull();
});

it('Should set initial selection', () => {
  const range = document.createRange();
  range.selectNodeContents(document.getElementById('target')!);
  range.getBoundingClientRect = vi.fn();

  const selection = document.getSelection()!;

  act(() => {
    selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });

  const { result } = renderHook(useTextSelection);

  expect(result.current.text).toBe('target');
  expect(result.current.ranges.length).toBe(1);
  expect(result.current.rects.length).toBe(1);
});

it('Should handle selection change', () => {
  const { result } = renderHook(useTextSelection);

  const range = document.createRange();
  range.selectNodeContents(document.getElementById('target')!);
  range.getBoundingClientRect = vi.fn();

  const selection = document.getSelection()!;

  act(() => {
    selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });

  expect(result.current.text).toBe('target');
  expect(result.current.ranges.length).toBe(1);
  expect(result.current.rects.length).toBe(1);
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

  const { unmount } = renderHook(useTextSelection);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('selectionchange', expect.any(Function));
});
