import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDocumentEvent } from './useDocumentEvent';

it('Should use document event', () => {
  const listener = vi.fn();
  renderHook(() => useDocumentEvent('click', listener));

  document.dispatchEvent(new Event('click'));

  expect(listener).toHaveBeenCalledOnce();
});

it('Should use document event on server side', () => {
  const listener = vi.fn();
  renderHookServer(() => useDocumentEvent('click', listener));

  document.dispatchEvent(new Event('click'));

  expect(listener).not.toHaveBeenCalledOnce();
});
