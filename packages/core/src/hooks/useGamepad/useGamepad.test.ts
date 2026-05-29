import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { mapGamepadToXbox360Controller, useGamepad } from './useGamepad';

const createButton = (pressed = false, value = 0): GamepadButton => ({
  pressed,
  touched: pressed,
  value
});

const createGamepad = (overrides: Partial<Gamepad> = {}): Gamepad => {
  const buttons = Array.from({ length: 16 }).fill(createButton());
  const axes = [0, 0, 0, 0];

  return {
    axes,
    buttons,
    connected: true,
    id: 'Xbox Controller',
    index: 0,
    mapping: 'standard',
    timestamp: Date.now(),
    hand: '',
    pose: null,
    ...overrides
  } as Gamepad;
};

const createGamepadEvent = (
  type: 'gamepadconnected' | 'gamepaddisconnected',
  gamepad: Gamepad
): GamepadEvent => {
  const event = new Event(type) as GamepadEvent;
  (event as any).gamepad = gamepad;
  return event;
};

const getGamepadsMock = vi.fn<() => Gamepad[]>(() => []);

beforeEach(() => {
  getGamepadsMock.mockReset();
  getGamepadsMock.mockReturnValue([]);

  Object.defineProperty(globalThis.navigator, 'getGamepads', {
    value: getGamepadsMock,
    configurable: true
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use gamepad', () => {
  const { result } = renderHook(useGamepad);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.gamepads).toEqual([]);
});

it('Should use gamepad on server side', () => {
  const { result } = renderHookServer(useGamepad);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.gamepads).toEqual([]);
});

it('Should use gamepad for unsupported', () => {
  Object.defineProperty(globalThis.navigator, 'getGamepads', {
    value: undefined,
    configurable: true
  });

  const { result } = renderHook(useGamepad);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.gamepads).toEqual([]);
});

it('Should initialize gamepads and merge haptic actuators', async () => {
  const vibrationActuator = {
    effects: [],
    playEffect: vi.fn(),
    reset: vi.fn(),
    type: 'vibration'
  } as unknown as GamepadHapticActuator;
  const additionalActuator = {
    effects: [],
    playEffect: vi.fn(),
    reset: vi.fn(),
    type: 'vibration'
  } as unknown as GamepadHapticActuator;
  const gamepad = createGamepad({
    hapticActuators: [additionalActuator],
    index: 2,
    vibrationActuator
  });

  getGamepadsMock.mockReturnValue([gamepad]);

  const { result } = renderHook(useGamepad);

  await waitFor(() => {
    expect(result.current.gamepads).toHaveLength(1);
    const [gamepad] = result.current.gamepads;
    expect(gamepad.index).toBe(2);
    expect(gamepad.hapticActuators).toEqual([vibrationActuator, additionalActuator]);
  });
});

it('Should change state on connect and disconnect events', () => {
  const gamepad = createGamepad({ index: 1 });
  const { result } = renderHook(useGamepad);

  const connectedEvent = createGamepadEvent('gamepadconnected', gamepad);
  act(() => document.dispatchEvent(connectedEvent));

  expect(result.current.gamepads).toHaveLength(1);
  expect(result.current.gamepads[0].index).toBe(1);

  const disconnectedEvent = createGamepadEvent('gamepaddisconnected', gamepad);
  act(() => document.dispatchEvent(disconnectedEvent));

  expect(result.current.gamepads).toEqual([]);
});

it('Should map gamepad to xbox 360 controller', () => {
  const gamepad = createGamepad({
    axes: [0.1, -0.2, 0.3, -0.4],
    buttons: Array.from({ length: 16 }, (_, index) => createButton(index === 0, index / 10))
  });

  const mapped = mapGamepadToXbox360Controller(gamepad);

  expect(mapped.buttons.a).toEqual(gamepad.buttons[0]);
  expect(mapped.buttons.b).toEqual(gamepad.buttons[1]);
  expect(mapped.stick.left.horizontal).toBe(0.1);
  expect(mapped.stick.left.vertical).toBe(-0.2);
  expect(mapped.stick.right.horizontal).toBe(0.3);
  expect(mapped.stick.right.vertical).toBe(-0.4);
  expect(mapped.dpad.right).toEqual(gamepad.buttons[15]);
  expect(mapped.start).toEqual(gamepad.buttons[9]);
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  const { unmount } = renderHook(useGamepad);

  expect(addEventListenerSpy).toHaveBeenCalledWith('gamepadconnected', expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('gamepaddisconnected', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('gamepadconnected', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('gamepaddisconnected', expect.any(Function));
});
