import { useKeyPress } from '@siberiacancode/reactuse';

const Demo = () => {
  const pressedKey = useKeyPress('a');

  return (
    <p>
      Press{pressedKey.pressed && 'ed'} <code>A</code> keyboard button
    </p>
  );
};

export default Demo;
