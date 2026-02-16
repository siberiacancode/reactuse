import { act, renderHook } from '@testing-library/react';

import { createTrigger } from '@/tests';

import { usePreferredReducedMotion } from './usePreferredReducedMotion';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMedia = {
  matches: false,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  },
  dispatchEvent: vi.fn()
};

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => mockMatchMedia
  });
});

afterEach(() => {
  mockMatchMedia.matches = false;
});

it('Should use preferred reduced motion', () => {
  const { result } = renderHook(usePreferredReducedMotion);

  expect(result.current).toBe('no-preference');
});

it('Should return true if user prefers reduced motion', () => {
  mockMatchMedia.matches = true;

  const { result } = renderHook(usePreferredReducedMotion);

  expect(result.current).toBe('reduce');
});

it('Should handle reduced motion preference changes', () => {
  const { result } = renderHook(usePreferredReducedMotion);

  expect(result.current).toBe('no-preference');

  mockMatchMedia.matches = true;
  act(() => trigger.callback('change'));

  expect(result.current).toBe('reduce');
});
