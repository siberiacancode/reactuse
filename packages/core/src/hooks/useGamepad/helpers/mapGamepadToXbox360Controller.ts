export const mapGamepadToXbox360Controller = (gamepad: Gamepad) => ({
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
