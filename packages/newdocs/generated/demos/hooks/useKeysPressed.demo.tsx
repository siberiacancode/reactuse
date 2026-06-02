'use client'

import { useKeysPressed } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const KEYBOARD = [
  [
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' }
  ],
  [
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' }
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', wide: true },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' }
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl' },
    { code: 'AltLeft', label: 'Alt' },
    { code: 'Space', label: 'Space', wide: true },
    { code: 'AltRight', label: 'Alt' },
    { code: 'ControlRight', label: 'Ctrl' }
  ]
];

const Demo = () => {
  const keysPressed = useKeysPressed();
  const pressedCodes = new Set(keysPressed.value.map(({ code }) => code));

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-4'>
      <div className='flex flex-col items-center gap-1.5'>
        {KEYBOARD.map((row, i) => (
          <div key={i} className='flex gap-1.5'>
            {row.map((key) => {
              const active = pressedCodes.has(key.code);
              return (
                <div
                  key={key.code}
                  className={cn(
                    'border-border bg-card text-muted-foreground flex h-8 items-center justify-center rounded-md border font-mono text-[10px] font-medium transition-colors',
                    key.wide ? 'w-16' : 'w-8',
                    active && 'border-foreground bg-foreground text-background'
                  )}
                >
                  {key.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
