import React from 'react';

import { useIntersectionObserver } from './useIntersectionObserver';

const Demo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useIntersectionObserver<HTMLDivElement>({
    root: containerRef.current,
    threshold: 1
  });

  return (
    <div>
      <div style={{ width: 300, height: 300, overflow: 'scroll', border: '1px solid' }}>
        scroll here
        <div style={{ height: 800 }}>
          <div
            ref={ref}
            style={{
              border: '1px solid',
              height: 100,
              width: 100,
              textAlign: 'center',
              marginTop: 80
            }}
          >
            observer dom
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, color: inView ? '#87d068' : '#f50' }}>
        inViewport: {inView ? 'visible' : 'hidden'}
      </div>
    </div>
  );
};

export default Demo;
