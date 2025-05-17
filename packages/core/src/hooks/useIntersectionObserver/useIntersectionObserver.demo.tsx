import { useIntersectionObserver } from '@siberiacancode/reactuse';
import { useRef } from 'react';

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useIntersectionObserver<HTMLDivElement>({
    root: rootRef,
    threshold: 1
  });

  return (
    <div className='text-center'>
      <div className='text-center'>
        Element{' '}
        <code className='font-bold'>{intersectionObserver.inView ? 'inside' : 'outside'}</code> the
        viewport
      </div>

      <div
        ref={rootRef}
        className='my-8 h-52 overflow-y-scroll rounded-xl border-2 border-dashed border-gray-400'
      >
        <p className='mb-72 py-8 text-center text-xl italic opacity-80'>Scroll me down!</p>
        <div
          ref={intersectionObserver.ref}
          className='mx-8 mb-96 max-h-40 rounded-xl border-2 border-dashed border-blue-500 p-4'
        >
          <p>Hello world!</p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
