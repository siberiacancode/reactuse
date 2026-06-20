import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useVirtualKeyboard } from './useVirtualKeyboard';

class MockVirtualKeyboard extends EventTarget {
  boundingRect = new DOMRect();
  overlaysContent = false;

  show() {
    return undefined;
  }

  hide() {
    return undefined;
  }

  addEventListener(type: 'geometrychange', listener: EventListener) {
    return super.addEventListener(type, listener);
  }

  removeEventListener(type: 'geometrychange', listener: EventListener) {
    return super.removeEventListener(type, listener);
  }
}

class MockVisualViewport extends EventTarget {
  constructor(public height: number) {
    super();
  }

  addEventListener(type: 'resize', listener: EventListener) {
    return super.addEventListener(type, listener);
  }

  removeEventListener(type: 'resize', listener: EventListener) {
    return super.removeEventListener(type, listener);
  }
}

const originalNavigator = globalThis.navigator;
const originalVisualViewport = window.visualViewport;
const originalScreenHeight = window.screen.height;

let virtualKeyboard: MockVirtualKeyboard;
let visualViewport: MockVisualViewport;

beforeEach(() => {
  virtualKeyboard = new MockVirtualKeyboard();
  visualViewport = new MockVisualViewport(900);

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      ...originalNavigator,
      virtualKeyboard
    },
    configurable: true,
    writable: true
  });

  Object.defineProperty(window, 'visualViewport', {
    value: visualViewport,
    configurable: true,
    writable: true
  });

  Object.defineProperty(window.screen, 'height', {
    value: 1000,
    configurable: true
  });
});

afterEach(() => {
  Object.defineProperty(globalThis, 'navigator', {
    value: originalNavigator,
    configurable: true,
    writable: true
  });

  Object.defineProperty(window, 'visualViewport', {
    value: originalVisualViewport,
    configurable: true,
    writable: true
  });

  Object.defineProperty(window.screen, 'height', {
    value: originalScreenHeight,
    configurable: true
  });

  vi.restoreAllMocks();
});

it('Should use virtual keyboard', () => {
  const { result } = renderHook(() => useVirtualKeyboard());

  expect(result.current.supported).toBeTruthy();
  expect(result.current.opened).toBeFalsy();
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.hide).toBeTypeOf('function');
  expect(result.current.changeOverlaysContent).toBeTypeOf('function');
});

it('Should use virtual keyboard on server side', () => {
  const { result } = renderHookServer(() => useVirtualKeyboard());

  expect(result.current.supported).toBeFalsy();
  expect(result.current.opened).toBeFalsy();
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.hide).toBeTypeOf('function');
  expect(result.current.changeOverlaysContent).toBeTypeOf('function');
});

it('Should use virtual keyboard for unsupported', () => {
  Object.defineProperty(globalThis, 'navigator', {
    value: originalNavigator,
    configurable: true,
    writable: true
  });

  delete (window as Partial<Window>).visualViewport;

  const { result } = renderHook(() => useVirtualKeyboard());

  expect(result.current.supported).toBeFalsy();
  expect(result.current.opened).toBeFalsy();
});

it('Should show virtual keyboard', () => {
  const showSpy = vi.spyOn(virtualKeyboard, 'show');
  const { result } = renderHook(() => useVirtualKeyboard());

  act(() => result.current.show());

  expect(showSpy).toHaveBeenCalledOnce();
  expect(result.current.opened).toBeTruthy();
});

it('Should hide virtual keyboard', () => {
  const hideSpy = vi.spyOn(virtualKeyboard, 'hide');
  const { result } = renderHook(() => useVirtualKeyboard(true));

  act(() => result.current.hide());

  expect(hideSpy).toHaveBeenCalledOnce();
  expect(result.current.opened).toBeFalsy();
});

it('Should change overlays content', () => {
  const { result } = renderHook(() => useVirtualKeyboard());

  expect(virtualKeyboard.overlaysContent).toBeTruthy();

  act(() => result.current.changeOverlaysContent(false));

  expect(virtualKeyboard.overlaysContent).toBeFalsy();
});

it('Should handle geometrychange event', () => {
  const { result } = renderHook(() => useVirtualKeyboard());

  expect(result.current.opened).toBeFalsy();

  act(() => {
    virtualKeyboard.boundingRect = new DOMRect(0, 0, 0, 200);
    virtualKeyboard.dispatchEvent(new Event('geometrychange'));
  });

  expect(result.current.opened).toBeTruthy();
});

it('Should handle resize fallback event', () => {
  const { result } = renderHook(() => useVirtualKeyboard());

  expect(result.current.opened).toBeFalsy();

  act(() => {
    visualViewport.height = 600;
    visualViewport.dispatchEvent(new UIEvent('resize'));
  });

  expect(result.current.opened).toBeTruthy();
});

it('Should cleanup on unmount', () => {
  const addGeometryChangeListenerSpy = vi.spyOn(virtualKeyboard, 'addEventListener');
  const removeGeometryChangeListenerSpy = vi.spyOn(virtualKeyboard, 'removeEventListener');
  const addResizeListenerSpy = vi.spyOn(visualViewport, 'addEventListener');
  const removeResizeListenerSpy = vi.spyOn(visualViewport, 'removeEventListener');

  const { unmount } = renderHook(() => useVirtualKeyboard());

  expect(addGeometryChangeListenerSpy).toHaveBeenCalledWith('geometrychange', expect.any(Function));
  expect(addResizeListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

  unmount();

  expect(removeGeometryChangeListenerSpy).toHaveBeenCalledWith(
    'geometrychange',
    expect.any(Function)
  );
  expect(removeResizeListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
});
