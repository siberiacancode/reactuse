import { useRef } from 'react';

import { useIntersectionObserver } from './useIntersectionObserver';

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useIntersectionObserver<HTMLDivElement>({
    root: rootRef,
    threshold: 1
  });

  return (
    <div className="text-center">
      <div className="text-center">
        Element <code className="font-bold">{intersectionObserver.inView ? 'inside' : 'outside'}</code> the viewport
      </div>

      <div ref={rootRef} className="border-2 border-dashed border-gray-400 h-52 my-8 overflow-y-scroll rounded-xl">
        <p className="text-center py-8 mb-72 italic text-xl opacity-80">
          Scroll me down!
        </p>
        <div ref={intersectionObserver.ref} className="border-2 border-dashed border-blue-500 p-4 max-h-40 mx-8 mb-96 rounded-xl">
          <p>Hello world!</p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
