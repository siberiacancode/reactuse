import { useKeyboard } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  useKeyboard({
    onKeyDown: (event) => {
      event.preventDefault();
      setPressedKeys((prevPressedKeys) => {
        if (!prevPressedKeys.includes(event.key)) {
          return [...prevPressedKeys, event.key];
        }
        return prevPressedKeys;
      });
    },
    onKeyUp: (event) => {
      event.preventDefault();
      setPressedKeys((prevPressedKeys) =>
        prevPressedKeys.filter((key) => key.toLowerCase() !== event.key.toLowerCase())
      );
    }
  });

  return (
    <div>
      <span>Currently pressed keys:</span>
      <div className='flex flex-wrap gap-2'>
        {pressedKeys.map((key) => (
          <code key={key}>{key}</code>
        ))}
      </div>
    </div>
  );
};

export default Demo;
