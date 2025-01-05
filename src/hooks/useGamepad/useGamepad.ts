import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';
import { useRaf } from '../useRaf/useRaf';

declare global {
  interface Gamepad {
    hapticActuators?: GamepadHapticActuator[];
  }
}

/** The use gamepad return type  */
export interface UseGamepadStateReturn {
  /** The gamepad active status */
  active: boolean;
  /** The gamepad state */
  gamepads: Gamepad[];
  /** The gamepad supported status */
  supported: boolean;
}

/**
 * @name useGamepad
 * @description - Hook for getting information about gamepad
 * @category Browser
 *
 * @returns {UseGamepadStateReturn} An object containing the gamepad information
 *
 * @example
 * const { supported, gamepads, active } = useGamepad();
 */
export const useGamepad = () => {
  const supported = typeof navigator !== 'undefined' && 'getGamepads' in navigator;
  const [gamepads, setGamepads] = useState<Record<number, Gamepad>>({});

  const { active } = useRaf(() => {}, { enabled: !!Object.keys(gamepads).length });

  const createGamepad = (gamepad: Gamepad) => {
    const hapticActuators = [];
    const vibrationActuator = 'vibrationActuator' in gamepad ? gamepad.vibrationActuator : null;

    if (vibrationActuator) hapticActuators.push(vibrationActuator);
    if (gamepad.hapticActuators) hapticActuators.push(...gamepad.hapticActuators);

    return {
      ...gamepad,
      hapticActuators
    } as Gamepad;
  };

  useEffect(() => {
    if (!supported) return;
    const gamepads = navigator.getGamepads();
    setGamepads(
      gamepads.reduce(
        (acc, gamepad) => ({ ...acc, ...(gamepad && { [gamepad.index]: createGamepad(gamepad) }) }),
        {}
      )
    );
  }, []);

  const onConnected = useEvent((event: Event) => {
    const { gamepad } = event as GamepadEvent;
    setGamepads({ ...gamepads, [gamepad.index]: createGamepad(gamepad) });
  });

  const onDisconnected = useEvent((event: Event) => {
    const { gamepad } = event as GamepadEvent;
    const updatedGamepads = { ...gamepads };
    delete updatedGamepads[gamepad.index];
    setGamepads(updatedGamepads);
  });

  useEffect(() => {
    document.addEventListener('gamepadconnected', onConnected);
    document.addEventListener('gamepaddisconnected', onDisconnected);

    return () => {
      document.removeEventListener('gamepadconnected', onConnected);
      document.removeEventListener('gamepaddisconnected', onDisconnected);
    };
  }, []);

  return {
    active,
    supported,
    gamepads: Object.values(gamepads)
  };
};

export * from './helpers/mapGamepadToXbox360Controller';
