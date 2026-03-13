import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePreferredDark } from './usePreferredDark';

const queries = {
  dark: '(prefers-color-scheme: dark)'
};

const matchState: Record<string, boolean> = {
  [queries.dark]: false
};

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMedia = {
  media: queries.dark,
  get matches() {
    return matchState[queries.dark] ?? false;
  },
  set matches(value: boolean) {
    matchState[queries.dark] = value;
  },
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
  trigger.clear();
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
  matchState[queries.dark] = true;

  const { result } = renderHook(usePreferredDark);

  expect(result.current).toBeTruthy();
});

it('Should handle dark mode preference changes', () => {
  const { result } = renderHook(usePreferredDark);

  expect(result.current).toBeFalsy();

  matchState[queries.dark] = true;
  act(() => trigger.callback('change'));

  expect(result.current).toBeTruthy();
});
