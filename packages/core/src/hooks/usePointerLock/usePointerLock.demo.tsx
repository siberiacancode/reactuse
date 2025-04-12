import type { CSSProperties } from 'react';

import { cn } from '@siberiacancode/docs/utils';
import { useRef } from 'react';

import { useEventListener, usePointerLock } from '@siberiacancode/reactuse';

const getSideStyles = (index: number) =>
  ({
    '--i': index,
    transform: 'rotateY(calc(90deg * var(--i))) translateZ(50px)'
  }) as CSSProperties;
const getBaseStyles = (index: number) =>
  ({
    '--i': index,
    transform: 'rotateX(calc(90deg * var(--i))) translateZ(50px)'
  }) as CSSProperties;
const face =
  'absolute top-0 left-0 w-full h-full border-1 border-solid border-black backface-hidden bg-cyan-300';

const Demo = () => {
  const { element, unlock, lock } = usePointerLock();
  const positionRef = useRef({ x: 0, y: -45 });

  useEventListener(
    'mousemove',
    (event) => {
      if (!element) return;
      const cube = element as HTMLElement;
      positionRef.current.x -= event.movementY / 2;
      positionRef.current.y += event.movementX / 2;
      cube.style.transform = `rotateY(calc(${positionRef.current.y} * 1deg)) rotateX(calc(${positionRef.current.x} * 1deg))`;
    },
    { passive: true }
  );

  return (
    <div className='perspective-normal flex h-32 items-center justify-center'>
      <div
        className='transform-3d relative h-[100px] w-[100px] cursor-all-scroll'
        style={{ transform: `rotateY(calc(-45 * 1deg))` }}
        onMouseDownCapture={lock}
        onMouseUpCapture={unlock}
      >
        <div className={face} style={getBaseStyles(1)} />
        <div className={face} style={getBaseStyles(-1)} />
        <div
          className={cn(face, 'flex items-center justify-center text-lg text-gray-700')}
          style={getSideStyles(0)}
        >
          move me
        </div>
        <div className={face} style={getSideStyles(1)} />
        <div className={face} style={getSideStyles(2)} />
        <div className={face} style={getSideStyles(3)} />
      </div>
    </div>
  );
};

export default Demo;
