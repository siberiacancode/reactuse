import { cn } from '@siberiacancode/docs/utils';
import { useHover, useMouse } from '@siberiacancode/reactuse';
import { useRef } from 'react';

const Demo = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse<HTMLDivElement>((value) => {
    if (!modalRef.current) return;
    const modal = modalRef.current;
    modal.style.left = `${value.clientX + 24}px`;
    modal.style.top = `${value.clientY + 24}px`;
    modalRef.current.textContent = `x: ${value.clientX}, y: ${value.clientY}`;
  });

  const hover = useHover<HTMLDivElement>();

  return (
    <div ref={mouse.ref} className='flex min-h-[400px] items-center justify-center'>
      <div
        ref={hover.ref}
        className={cn(
          'relative flex h-[300px] w-[340px] items-center justify-center rounded-xl border-2 border-dashed transition-all duration-500',
          {
            'border-green-500': hover.value
          }
        )}
      >
        <span className='text-center text-lg font-medium text-white select-none'>
          Use a ref to add coords
          <br />
          relative to the element
        </span>

        <div
          ref={modalRef}
          className='fixed z-50 rounded-lg border-1 bg-[var(--vp-code-block-bg)] p-6'
        />
      </div>
    </div>
  );
};

export default Demo;
