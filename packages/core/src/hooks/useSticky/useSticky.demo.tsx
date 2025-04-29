import { cn } from '@siberiacancode/docs/utils';
import { useSticky } from '@siberiacancode/reactuse';
import { useRef } from 'react';

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref, stuck } = useSticky<HTMLDivElement>({
    root: rootRef
  });

  return (
    <div ref={rootRef} className='scroll-container h-96 overflow-y-auto p-2'>
      <div className='flex h-24 items-center justify-center'>
        Scroll down to see the element stick to the top
      </div>

      <div
        ref={ref}
        className={cn(
          'sticky top-10 flex items-center justify-center rounded-xl border-2 p-10 transition-all',
          stuck ? 'border-green-500 bg-green-400/20' : 'border-gray-300'
        )}
      >
        {stuck ? 'Stuck' : 'Not stuck'}
      </div>

      <div className='flex h-[800px] items-center justify-center'>More content here</div>
    </div>
  );
};

export default Demo;
