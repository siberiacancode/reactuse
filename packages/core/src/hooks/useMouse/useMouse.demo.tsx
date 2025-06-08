import { cn } from '@siberiacancode/docs/utils';
import { useHover, useMouse } from '@siberiacancode/reactuse';

const Demo = () => {
  const { x, y, clientX, clientY } = useMouse();
  const hover = useHover<HTMLDivElement>();

  return (
    <div className='flex min-h-[400px] items-center justify-center'>
      <div
        ref={hover.ref}
        className={cn(
          'relative flex h-[300px] w-[340px] items-center justify-center rounded-xl border-2 border-dashed transition-all duration-500',
          {
            'border-green-500': hover.value
          }
        )}
      >
        <span className='select-none text-center text-lg font-medium text-white'>
          Use a ref to add coords
          <br />
          relative to the element
        </span>

        <div
          style={{
            left: clientX + 24,
            top: clientY + 24
          }}
          className='border-1 fixed z-50 rounded-lg bg-[var(--vp-code-block-bg)] p-6'
        >
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-medium'>mouse position</div>
            <div>
              <div>
                x <code>{x}</code>
              </div>
              <div>
                y <code>{y}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
