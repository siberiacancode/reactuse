import { useKeyPress } from '@siberiacancode/reactuse';

const Demo = () => {
  const pressedKey = useKeyPress('a', (pressed, event) => {
    if (pressed) console.log('pressed', pressed, event);
  });

  return (
    <p>
      Press{pressedKey.pressed && 'ed'} <code>A</code> keyboard button
    </p>
  );
};

export default Demo;
