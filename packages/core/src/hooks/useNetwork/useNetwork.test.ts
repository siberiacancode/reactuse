import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useNetwork } from './useNetwork';

const trigger = createTrigger<string, () => void>();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockConnection = {
  downlink: 10,
  downlinkMax: 100,
  effectiveType: '4g',
  rtt: 50,
  saveData: false,
  type: 'wifi',
  onChange: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  },
  dispatchEvent: (event: Event) => {
    trigger.callback(event.type);
    return true;
  }
};

beforeEach(() => {
  Object.defineProperty(navigator, 'connection', {
    value: mockConnection,
    writable: true,
    configurable: true
  });

  trigger.clear();
  mockAddEventListener.mockClear();
  mockRemoveEventListener.mockClear();

  mockConnection.downlink = 10;
  mockConnection.downlinkMax = 100;
  mockConnection.effectiveType = '4g';
  mockConnection.rtt = 50;
  mockConnection.saveData = false;
  mockConnection.type = 'wifi';
});

it('Should use network', () => {
  const { result } = renderHook(useNetwork);
  expect(result.current).toEqual({
    online: true,
    downlink: 10,
    downlinkMax: 100,
    effectiveType: '4g',
    rtt: 50,
    saveData: false,
    type: 'wifi'
  });
});

it('Should use network on server side', () => {
  const { result } = renderHookServer(useNetwork);
  expect(result.current).toEqual({
    online: false,
    type: undefined,
    effectiveType: undefined,
    saveData: false,
    downlink: 0,
    downlinkMax: 0,
    rtt: 0
  });
});

it('Should change state upon network events', () => {
  const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useNetwork);
  expect(result.current.online).toBeTruthy();

  mockNavigatorOnline.mockReturnValue(false);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current.online).toBeFalsy();

  mockNavigatorOnline.mockReturnValue(true);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current.online).toBeTruthy();
});

it('Should call callback when network state changes', () => {
  const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');
  const callback = vi.fn();

  mockNavigatorOnline.mockReturnValue(true);
  renderHook(() => useNetwork(callback));

  mockConnection.type = 'cellular';
  mockConnection.effectiveType = '3g';
  mockConnection.downlink = 3;
  mockConnection.rtt = 120;

  act(() => mockConnection.dispatchEvent(new Event('change')));

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith({
    online: true,
    downlink: 3,
    downlinkMax: 100,
    effectiveType: '3g',
    rtt: 120,
    saveData: false,
    type: 'cellular'
  });
});

it('Should cleanup up on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useNetwork);

  expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function), {
    passive: true
  });
  expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function), {
    passive: true
  });

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
});
