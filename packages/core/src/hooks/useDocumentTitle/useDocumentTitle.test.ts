import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger } from '@/tests';

import { useDocumentTitle } from './useDocumentTitle';

const trigger = createTrigger<Node, MutationCallback>();
const mockMutationObserverObserve = vi.fn();
const mockMutationObserverDisconnect = vi.fn();
class MockMutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  callback: MutationCallback;

  observe = () => {
    trigger.add(document.head.querySelector('title')!, this.callback);
    mockMutationObserverObserve();
  };
  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

beforeEach(() => {
  document.title = 'default title';
});

it('Should use document title', () => {
  const { result } = renderHook(useDocumentTitle);
  const { value, set } = result.current;

  expect(value).toBe('default title');
  expect(set).toBeTypeOf('function');
});

it('Should be set initial title', () => {
  const { result } = renderHook(() => useDocumentTitle('title'));

  waitFor(() => expect(result.current.value).toBe('title'));
});

it('Should be set new title', () => {
  const { result } = renderHook(useDocumentTitle);

  act(() => result.current.set('new title'));
  waitFor(() => expect(result.current.value).toBe('new title'));
});

it('Should observe title changes', async () => {
  const { result } = renderHook(useDocumentTitle);

  act(() => {
    document.title = 'changed externally';
    trigger.callback(document.head.querySelector('title')!);
  });

  await waitFor(() => expect(result.current.value).toBe('changed externally'));
});

it('Should be restore initial title when unmount', () => {
  const { result, unmount } = renderHook(() =>
    useDocumentTitle('title', { restoreOnUnmount: true })
  );

  act(() => result.current.set('new title'));
  waitFor(() => expect(result.current.value).toBe('new title'));

  unmount();
  waitFor(() => expect(result.current.value).toBe('title'));
});

it('Should disconnect on unmount', () => {
  const { unmount } = renderHook(() => useDocumentTitle('title'));

  unmount();

  expect(mockMutationObserverDisconnect).toHaveBeenCalledOnce();
});
