import { useSwipe } from '@siberiacancode/reactuse';
import { useRef } from 'react';

const Demo = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const setCardStyles = (x: number) => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `translateX(${x}px)`;
  };

  const swipe = useSwipe<HTMLDivElement>({
    onStart: () => {
      document.body.style.userSelect = 'none';
    },
    onMove: (value) => {
      if (!cardRef.current) return;

      if (value.lengthX >= 0) {
        setCardStyles(0);
        return;
      }

      const distance = Math.abs(value.lengthX);
      setCardStyles(distance);
    },
    onEnd: (value) => {
      if (!cardRef.current) return;

      const width = cardRef.current.offsetWidth ?? 0;
      const swipeDistance = value.lengthX < 0 ? Math.abs(value.lengthX) : 0;
      const shouldDismiss = width > 0 && swipeDistance / width >= 0.5;

      if (shouldDismiss) {
        setCardStyles(width);
      } else {
        setCardStyles(0);
      }
    }
  });

  const cardClassName = [
    'absolute inset-0 flex select-none items-center justify-center rounded-xl bg-[var(--vp-c-brand-1)]',
    swipe.swiping ? '' : 'transition-all duration-200 ease-linear'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={swipe.ref}
      className='relative mx-auto flex h-[96px] w-full max-w-md items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white select-none'
    >
      <button
        className='rounded-md bg-white px-3 py-1 text-sm font-medium'
        type='button'
        onClick={() => {
          if (!cardRef.current) return;
          setCardStyles(0);
        }}
      >
        Reset
      </button>

      <div
        ref={cardRef}
        style={{
          transform: 'translateX(0)',
          opacity: 1,
          touchAction: 'pan-y'
        }}
        className={cardClassName}
      >
        <p className='shrink-0 whitespace-nowrap text-white'>Swipe left to right</p>
      </div>
    </div>
  );
};

export default Demo;
