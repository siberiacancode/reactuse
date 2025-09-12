import { useClickOutside, useLockScroll, useRightClick } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const useContextMenu = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>();

  const timerIdRef = useRef<NodeJS.Timeout>(null);

  useLockScroll({
    enabled: !!position
  });

  const triggerRef = useRightClick<HTMLDivElement>(
    (positions, event) => {
      if (event instanceof MouseEvent) setPosition(positions);
    },
    {
      onStart: (event) => {
        timerIdRef.current = setTimeout(() => {
          if (event instanceof MouseEvent) return;
          const touchEvent = event as TouchEvent;
          const touch = touchEvent.touches[0];
          if (!touch) return;
          setPosition({ x: touch.clientX, y: touch.clientY });
        }, 500);
      },
      onEnd: () => {
        if (timerIdRef.current) clearTimeout(timerIdRef.current);
      }
    }
  );

  const contextMenuRef = useClickOutside<HTMLDivElement>(() => setPosition(undefined));

  return { triggerRef, contextMenuRef, position };
};

const Demo = () => {
  const contextMenu = useContextMenu();

  return (
    <div
      ref={contextMenu.triggerRef}
      className='relative flex h-20 cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-2 text-lg'
    >
      Right click me
      {!!contextMenu.position?.x && !!contextMenu.position?.y && (
        <div
          ref={contextMenu.contextMenuRef}
          style={{
            top: contextMenu.position.y,
            left: contextMenu.position.x
          }}
          className='fixed z-10 flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-[var(--vp-code-block-bg)] p-5'
        >
          Context menu
        </div>
      )}
    </div>
  );
};

export default Demo;
