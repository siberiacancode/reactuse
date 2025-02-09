
import type { CSSProperties } from 'react';

import { useRef } from 'react';

import { useEventListener } from '../useEventListener/useEventListener';
import { usePointerLock } from './usePointerLock';

const getSideStyles = (index: number) => ({
  "--i": index,
  transform: "rotateY(calc(90deg * var(--i))) translateZ(50px)"
} as CSSProperties)
const getBaseStyles = (index: number) => ({ "--i": index, transform: "rotateX(calc(90deg * var(--i))) translateZ(50px)" } as CSSProperties)
const face = 'absolute top-0 left-0 w-full h-full border-1 border-solid border-black backface-hidden bg-cyan-500 opacity-50'


const Demo = () => {
  const { element, unlock, lock } = usePointerLock();
  const positionRef = useRef({ x: 0, y: 0 });

  useEventListener('mousemove', (event) => {
    positionRef.current = { x: positionRef.current.x + event.movementX, y: positionRef.current.y + event.movementY };
    if (!element) return
    const cube = element as HTMLElement;
    const x = positionRef.current.y + event.movementY / 2
    const y = positionRef.current.x + event.movementX / 2
    cube.style.transform = `rotateY(calc(${y} * 1deg)) rotateX(calc(${x} * 1deg))`
  }, { passive: true })

  return (
    <div className='flex justify-center items-center perspective-normal h-32'>
      <div className='cursor-all-scroll relative w-[100px] h-[100px] transform-3d' onMouseDownCapture={lock} onMouseUpCapture={unlock}>
        <span className={face} style={getBaseStyles(1)} />
        <span className={face} style={getBaseStyles(-1)} />
        <span className={face} style={getSideStyles(0)} />
        <span className={face} style={getSideStyles(1)} />
        <span className={face} style={getSideStyles(2)} />
        <span className={face} style={getSideStyles(3)} />
      </div>
    </div>
  )
};

export default Demo;
