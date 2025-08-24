import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDocumentEvent } from './useDocumentEvent';

it('Should use document event', () => {
  const listener = vi.fn();
  renderHook(() => useDocumentEvent('click', listener));

  document.dispatchEvent(new Event('click'));

  expect(listener).toHaveBeenCalled();
});
