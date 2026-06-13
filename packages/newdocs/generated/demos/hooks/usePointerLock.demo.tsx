'use client'

import type { CSSProperties } from 'react';

import { useEventListener, usePointerLock } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { cn } from '@/utils/lib';

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

const face = 'backface-hidden absolute top-0 left-0 h-full w-full border-2 border-black bg-white';

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
    <section className='flex flex-col items-center gap-6 p-6 select-none'>
      <div className='flex h-40 items-center justify-center perspective-normal'>
        <div
          className='relative size-[100px] cursor-grab transform-3d active:cursor-grabbing'
          style={{ transform: 'rotateY(calc(-45 * 1deg))' }}
          onMouseDownCapture={pointerLock.lock}
          onMouseUpCapture={pointerLock.unlock}
        >
          <div className={face} style={getBaseStyles(1)} />
          <div className={face} style={getBaseStyles(-1)} />
          <div
            className={cn(face, 'flex items-center justify-center text-sm font-medium text-black')}
            style={getSideStyles(0)}
          >
            move me
          </div>
          <div className={face} style={getSideStyles(1)} />
          <div className={face} style={getSideStyles(2)} />
          <div className={face} style={getSideStyles(3)} />
        </div>
      </div>

      <p className='text-muted-foreground text-center text-sm'>
        Press and hold the cube, then move your mouse to rotate it in 3D.
      </p>
    </section>
  );
};

export default Demo;
