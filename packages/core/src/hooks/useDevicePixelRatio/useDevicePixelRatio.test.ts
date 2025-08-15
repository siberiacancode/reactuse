import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useDevicePixelRatio } from './useDevicePixelRatio';

const trigger = createTrigger<string, () => void>();
const mockMediaQueryListAddEventListener = vi.fn();
const mockMediaQueryListRemoveEventListener = vi.fn();
const MockMediaQueryList = class MediaQueryList {
  query: string;

  constructor(query: string) {
    this.query = query;
  }

  addEventListener = (_type: keyof MediaQueryListEventMap, listener: any) => {
    trigger.add(this.query, listener);
    mockMediaQueryListAddEventListener();
  };
  removeEventListener = () => {
    trigger.delete(this.query);
    mockMediaQueryListRemoveEventListener();
  };

  matches = false;
  onchange = vi.fn();
  addListener = vi.fn();
  removeListener = vi.fn();
  dispatchEvent = vi.fn();
};

beforeEach(() => {
  Object.assign(globalThis.window, {
    devicePixelRatio: 1,
    matchMedia: vi.fn().mockImplementation((query) => {
      const mockMediaQueryList = new MockMediaQueryList(query);
      return { ...mockMediaQueryList, media: query };
    })
  });

  trigger.clear();
});

afterEach(() => {
  vi.clearAllMocks();
  mockMediaQueryListAddEventListener.mockClear();
  mockMediaQueryListRemoveEventListener.mockClear();
});

it('Should use device pixel ratio', () => {
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(window.devicePixelRatio);
  expect(result.current.supported).toBeTruthy();
});

it('Should use device pixel ratio on server side', () => {
  const { result } = renderHookServer(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(1);
  expect(result.current.supported).toBeFalsy();
});

it('Should use device pixel ratio for unsupported', () => {
  Object.assign(globalThis.window, {
    matchMedia: undefined
  });
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(1);
  expect(result.current.supported).toBeFalsy();
});

it('Should correct return for unsupported devicePixelRatio', () => {
  Object.assign(globalThis.window, {
    devicePixelRatio: undefined
  });
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(1);
  expect(result.current.supported).toBeFalsy();
});

it('Should handle media query change', () => {
  const { result } = renderHook(useDevicePixelRatio);
  expect(result.current.ratio).toEqual(1);

  Object.assign(globalThis.window, {
    devicePixelRatio: 3
  });

  expect(mockMediaQueryListAddEventListener).toHaveBeenCalledOnce();
  expect(mockMediaQueryListRemoveEventListener).not.toHaveBeenCalled();

  act(() => trigger.callback(`(resolution: 1dppx)`));

  expect(mockMediaQueryListAddEventListener).toHaveBeenCalledTimes(2);
  expect(mockMediaQueryListRemoveEventListener).toHaveBeenCalledOnce();
  expect(result.current.ratio).toEqual(3);
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(useDevicePixelRatio);

  unmount();

  expect(mockMediaQueryListRemoveEventListener).toHaveBeenCalledOnce();
});
