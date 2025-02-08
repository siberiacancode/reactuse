import { CSSProperties } from 'react';
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
        <div style={blockStyle}>First amazing block</div>
        <div style={blockStyle}>Second amazing block</div>
        <div style={blockStyle}>Third amazing block</div>
      </div>
      <div>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 0 })}>
          Scroll to block 1
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 260 })}>
          Scroll to block 2
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 520 })}>
          Scroll to block 3
        </button>
      </div>
    </div>
  );
};

export default Demo;
