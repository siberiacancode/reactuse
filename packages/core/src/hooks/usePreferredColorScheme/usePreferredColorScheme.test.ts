import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePreferredColorScheme } from './usePreferredColorScheme';

const queries = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)'
};

const matchState: Record<string, boolean> = {
  [queries.light]: false,
  [queries.dark]: false
};

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMedia = (query: string) => ({
  onchange: null,
  media: query,
  get matches() {
    return matchState[query] ?? false;
  },
  set matches(value: boolean) {
    matchState[query] = value;
  },
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(`${query}:${type}`, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(`${query}:${type}`) === callback) trigger.delete(`${query}:${type}`);
  },
  dispatchEvent: vi.fn()
});

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia
  });
});

afterEach(() => {
  Object.keys(matchState).forEach((key) => {
    matchState[key] = false;
  });
  trigger.clear();
});

it('Should use preferred color scheme', () => {
  const { result } = renderHook(usePreferredColorScheme);

  expect(result.current).toBe('no-preference');
});

it('Should use preferred color scheme on server side', () => {
  const { result } = renderHookServer(usePreferredColorScheme);

  expect(result.current).toBe('no-preference');
});

it('Should return light if user prefers light mode', () => {
  matchState[queries.light] = true;

  const { result } = renderHook(usePreferredColorScheme);

  expect(result.current).toBe('light');
});

it('Should return dark if user prefers dark mode', () => {
  matchState[queries.dark] = true;

  const { result } = renderHook(usePreferredColorScheme);

  expect(result.current).toBe('dark');
});

it('Should handle color scheme preference changes with light priority', () => {
  const { result } = renderHook(usePreferredColorScheme);

  expect(result.current).toBe('no-preference');

  matchState[queries.dark] = true;
  act(() => trigger.callback(`${queries.dark}:change`));

  expect(result.current).toBe('dark');

  matchState[queries.light] = true;
  act(() => trigger.callback(`${queries.light}:change`));

  expect(result.current).toBe('light');
});
