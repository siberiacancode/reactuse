import { useEffect, useState } from 'react';
import { useRaf } from '../useRaf/useRaf';
/**
 * @name useGamepad
 * @description - Hook for getting information about gamepad
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.getGamepads https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads
 *
 * @returns {UseGamepadStateReturn} An object containing the gamepad information
 *
 * @example
 * const { supported, gamepads, active } = useGamepad();
 */
export const useGamepad = () => {
  const supported = typeof navigator !== 'undefined' && 'getGamepads' in navigator;
  const [gamepads, setGamepads] = useState({});
  const createGamepad = (gamepad) => {
    const hapticActuators = [];
    const vibrationActuator = 'vibrationActuator' in gamepad ? gamepad.vibrationActuator : null;
    if (vibrationActuator) hapticActuators.push(vibrationActuator);
    if (gamepad.hapticActuators) hapticActuators.push(...gamepad.hapticActuators);
    return {
      ...gamepad,
      hapticActuators
    };
  };
  const updateGamepadState = () => {
    for (const gamepad of navigator.getGamepads() ?? []) {
      if (gamepad && gamepads[gamepad.index]) gamepads[gamepad.index] = createGamepad(gamepad);
    }
  };
  const { active } = useRaf(updateGamepadState, {
    enabled: !!Object.keys(gamepads).length
  });
  useEffect(() => {
    if (!supported) return;
    const gamepads = navigator.getGamepads();
    setGamepads(
      gamepads.reduce(
        (acc, gamepad) => ({
          ...acc,
          ...(gamepad && { [gamepad.index]: createGamepad(gamepad) })
        }),
        {}
      )
    );
  }, []);
  useEffect(() => {
    const onConnected = (event) => {
      const { gamepad } = event;
      setGamepads({ ...gamepads, [gamepad.index]: createGamepad(gamepad) });
    };
    const onDisconnected = (event) => {
      const { gamepad } = event;
      const updatedGamepads = { ...gamepads };
      delete updatedGamepads[gamepad.index];
      setGamepads(updatedGamepads);
    };
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
export const mapGamepadToXbox360Controller = (gamepad) => ({
  buttons: {
    a: gamepad.buttons[0],
    b: gamepad.buttons[1],
    x: gamepad.buttons[2],
    y: gamepad.buttons[3]
  },
  bumper: {
    left: gamepad.buttons[4],
    right: gamepad.buttons[5]
  },
  triggers: {
    left: gamepad.buttons[6],
    right: gamepad.buttons[7]
  },
  stick: {
    left: {
      horizontal: gamepad.axes[0],
      vertical: gamepad.axes[1],
      button: gamepad.buttons[10]
    },
    right: {
      horizontal: gamepad.axes[2],
      vertical: gamepad.axes[3],
      button: gamepad.buttons[11]
    }
  },
  dpad: {
    up: gamepad.buttons[12],
    down: gamepad.buttons[13],
    left: gamepad.buttons[14],
    right: gamepad.buttons[15]
  },
  back: gamepad.buttons[8],
  start: gamepad.buttons[9]
});
