import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePreferredContrast } from './usePreferredContrast';

const queries = {
  more: '(prefers-contrast: more)',
  less: '(prefers-contrast: less)',
  custom: '(prefers-contrast: custom)'
};

const matchState: Record<string, boolean> = {
  [queries.more]: false,
  [queries.less]: false,
  [queries.custom]: false
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
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
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

it('Should use preferred contrast', () => {
  const { result } = renderHook(usePreferredContrast);

  expect(result.current).toBe('no-preference');
});

it('Should use preferred contrast on server side', () => {
  const { result } = renderHookServer(usePreferredContrast);

  expect(result.current).toBe('no-preference');
});

it('Should return more if user prefers more contrast', () => {
  matchState[queries.more] = true;

  const { result } = renderHook(usePreferredContrast);

  expect(result.current).toBe('more');
});

it('Should return less if user prefers less contrast', () => {
  matchState[queries.less] = true;

  const { result } = renderHook(usePreferredContrast);

  expect(result.current).toBe('less');
});

it('Should return custom if user prefers custom contrast', () => {
  matchState[queries.custom] = true;

  const { result } = renderHook(usePreferredContrast);

  expect(result.current).toBe('custom');
});

it('Should handle contrast preference changes', () => {
  const { result } = renderHook(usePreferredContrast);

  expect(result.current).toBe('no-preference');

  matchState[queries.custom] = true;
  act(() => trigger.callback('change'));

  expect(result.current).toBe('custom');
});
