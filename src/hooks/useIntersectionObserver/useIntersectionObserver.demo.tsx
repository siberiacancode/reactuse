import { useRef } from 'react';

import { useIntersectionObserver } from './useIntersectionObserver';

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useIntersectionObserver<HTMLDivElement>({
    root: rootRef,
    threshold: 1
  });

  return (
    <div>
      <div style={{ width: 300, height: 300, overflow: 'scroll', border: '1px solid' }}>
        scroll here
        <div style={{ height: 800 }}>
          <div
            ref={intersectionObserver.ref}
            style={{
              border: '1px solid',
              height: 100,
              width: 100,
              textAlign: 'center',
              marginTop: 80
            }}
          >
            observer element
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, color: intersectionObserver.inView ? '#87d068' : '#f50' }}>
        in viewport: {intersectionObserver.inView ? 'visible' : 'hidden'}
      </div>
    </div>
  );
};

export default Demo;
