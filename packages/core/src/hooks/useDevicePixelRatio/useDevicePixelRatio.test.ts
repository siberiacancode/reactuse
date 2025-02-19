import { act, renderHook } from '@testing-library/react';

import { createTrigger } from '@/tests';

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
  vi.stubGlobal('devicePixelRatio', 1);
  vi.stubGlobal(
    'matchMedia',
    vi.fn<[string], MediaQueryList>().mockImplementation((query) => {
      const mockMediaQueryList = new MockMediaQueryList(query);
      return { ...mockMediaQueryList, media: query };
    })
  );
});

afterEach(() => {
  void vi.unstubAllGlobals();
  mockMediaQueryListAddEventListener.mockClear();
  mockMediaQueryListRemoveEventListener.mockClear();
});

it('Should use device pixel ratio', () => {
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(window.devicePixelRatio);
  expect(result.current.supported).toBeTruthy();
});

it('Should correct return for unsupported matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined);
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(1);
  expect(result.current.supported).toBeFalsy();
});

it('Should correct return for unsupported devicePixelRatio', () => {
  vi.stubGlobal('devicePixelRatio', undefined);
  const { result } = renderHook(useDevicePixelRatio);

  expect(result.current.ratio).toEqual(1);
  expect(result.current.supported).toBeFalsy();
});

it('Should handle media query change', () => {
  const { result } = renderHook(useDevicePixelRatio);
  expect(result.current.ratio).toEqual(1);

  Object.defineProperty(window, 'devicePixelRatio', {
    value: 3,
    configurable: true
  });

  expect(mockMediaQueryListAddEventListener).toHaveBeenCalledTimes(1);
  expect(mockMediaQueryListRemoveEventListener).toHaveBeenCalledTimes(0);

  act(() => trigger.callback(`(resolution: 1dppx)`));

  expect(mockMediaQueryListAddEventListener).toHaveBeenCalledTimes(2);
  expect(mockMediaQueryListRemoveEventListener).toHaveBeenCalledTimes(1);
  expect(result.current.ratio).toEqual(3);
});

it('Should disconnect on onmount', () => {
  const { unmount } = renderHook(useDevicePixelRatio);

  unmount();

  expect(mockMediaQueryListRemoveEventListener).toHaveBeenCalledTimes(1);
});
