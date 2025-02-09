import type { CSSProperties } from 'react';

import { useScrollTo } from './useScrollTo';

const blockStyle: CSSProperties = {
  border: '1px solid gray',
  width: '100%',
  padding: 20,
  textAlign: 'center',
  borderRadius: 5,
  height: 250,
  marginBottom: 10
};

const Demo = () => {
  const scrollTo = useScrollTo<HTMLDivElement>({ x: 0, y: 260 });

  return (
    <div>
      <div ref={scrollTo.ref} style={{ overflow: 'auto', height: 300, padding: 20 }}>
        <div style={blockStyle}><code>First</code> amazing block</div>
        <div style={blockStyle}><code>Second</code> amazing block</div>
        <div style={blockStyle}><code>Third</code>  amazing block</div>
      </div>
      <p>
        Scroll to:
      </p>
      <div className='flex w-full gap-2'>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 0, behavior: 'smooth' })}>
          1
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 260, behavior: 'smooth' })}>
          2
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 520, behavior: 'smooth' })}>
          3
        </button>
      </div>
    </div>
  );
};

export default Demo;
