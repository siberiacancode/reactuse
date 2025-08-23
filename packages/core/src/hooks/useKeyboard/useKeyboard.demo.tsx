import { useKeyboard } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  // Use object to track both key (character) and code (physical key)
  // this solves the keyboard layout switching issue
  const [pressedKeys, setPressedKeys] = useState<{ key: string; code: string }[]>([]);

  useKeyboard({
    onKeyDown: (event: KeyboardEvent) => {
      event.preventDefault();
      setPressedKeys((prevPressedKeys) => {
        // Check by event.code (physical key), not by event.key (character)
        // this prevents duplication when switching keyboard layout
        if (!prevPressedKeys.some(({ code }) => code === event.code)) {
          return [...prevPressedKeys, { key: event.key, code: event.code }];
        }
        return prevPressedKeys;
      });
    },
    onKeyUp: (event: KeyboardEvent) => {
      event.preventDefault();
      setPressedKeys((prevPressedKeys) =>
        // Remove by event.code to correctly handle key release
        // regardless of current keyboard layout
        prevPressedKeys.filter(({ code }) => code !== event.code)
      );
    }
  });

  return (
    <div>
      <span>Currently pressed keys:</span>
      <div className='flex flex-wrap gap-2'>
        {pressedKeys.map(({ key, code }) => (
          <code key={code}>{key}</code>
        ))}
      </div>
    </div>
  );
};

export default Demo;
