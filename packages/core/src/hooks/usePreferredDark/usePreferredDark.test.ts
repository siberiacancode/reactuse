import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePreferredDark } from './usePreferredDark';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMedia = {
  matches: false,
  media: '(prefers-color-scheme: dark)',
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
  vi.clearAllMocks();
  mockMatchMedia.matches = false;
});

it('Should use preferred dark mode', () => {
  const { result } = renderHook(usePreferredDark);

  expect(result.current).toBeFalsy();
});

it('Should use preferred dark on server side', () => {
  const { result } = renderHookServer(usePreferredDark);

  expect(result.current).toBeFalsy();
});

it('Should return true if user prefers dark mode', () => {
  mockMatchMedia.matches = true;

  const { result } = renderHook(usePreferredDark);

  expect(result.current).toBeTruthy();
});

it('Should handle dark mode preference changes', () => {
  const { result } = renderHook(usePreferredDark);

  expect(result.current).toBeFalsy();

  mockMatchMedia.matches = true;
  act(() => trigger.callback('change'));

  expect(result.current).toBeTruthy();
});
