import type { CSSProperties } from 'react';

import { cn } from '@siberiacancode/docs/utils';
import { useEventListener, usePointerLock } from '@siberiacancode/reactuse';
import { useRef } from 'react';

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
  const pointerLock = usePointerLock();
  const positionRef = useRef({ x: 0, y: -45 });

  useEventListener(
    'mousemove',
    (event) => {
      if (!pointerLock.element) return;
      const cube = pointerLock.element as HTMLElement;
      positionRef.current.x -= event.movementY / 2;
      positionRef.current.y += event.movementX / 2;
      cube.style.transform = `rotateY(calc(${positionRef.current.y} * 1deg)) rotateX(calc(${positionRef.current.x} * 1deg))`;
    },
    { passive: true }
  );

  if (!pointerLock.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div className='flex h-32 items-center justify-center perspective-normal'>
      <div
        className='relative h-[100px] w-[100px] cursor-all-scroll transform-3d'
        style={{ transform: `rotateY(calc(-45 * 1deg))` }}
        onMouseDownCapture={pointerLock.lock}
        onMouseUpCapture={pointerLock.unlock}
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
