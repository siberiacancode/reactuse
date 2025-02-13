import { useRef, useState } from 'react';

import { useSwipe } from './useSwipe';

const Demo = () => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);

  const { isSwiping, percent } = useSwipe(ref, {
    threshold: 10,
    directions: ['right'],
    onSwiping: ({ percent }) => {
      setOffset(percent);
    },
    onSwiped: ({ percent }) => {
      if (percent > 80) {
        setOffset(100);
        setIsSwiped(true);
      } else {
        setOffset(0);
      }
    }
  });

  const reset = () => {
    setOffset(0);
    setIsSwiped(false);
  };

  return (
    <>
      <p>swipe more than 80%</p>
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: 200,
          height: 50,
          border: '1px dashed #fff',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'relative',
            cursor: 'grab',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            background: '#5c73e7',
            transform: `translateX(${offset}%)`,
            opacity: `${(100 - offset) / 100} `
          }}
        >
          Swipe right
        </div>
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            zIndex: 0
          }}
          onClick={reset}
        >
          reset
        </button>
      </div>
      <p>
        isSwiping: <code>{isSwiping ? 'swiping' : 'not swiping'}</code>
      </p>
      <p>
        percent: <code> {percent}%</code>
      </p>
      <p>
        isSwiped: <code>{isSwiped ? 'swiped' : 'not swiped'}</code>
      </p>
    </>
  );
};

export default Demo;
