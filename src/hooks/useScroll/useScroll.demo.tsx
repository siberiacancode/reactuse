import { useState, type CSSProperties } from 'react';

import { useScroll, UseScrollCallbackParams } from './useScroll';
import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';

const container: CSSProperties = {
  width: '100%',
  height: '300px',
  overflow: 'scroll',
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  borderRadius: '8px'
}

const inner: CSSProperties = {
  width: '500px',
  height: '400px',
  position: 'relative'
}

const topLeft: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  padding: '4px 8px'
}

const bottomLeft: CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  padding: '4px 8px'
}

const topRight: CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 0,
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  padding: '4px 8px'
}

const bottomRight: CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  padding: '4px 8px'
}

const center: CSSProperties = {
  position: 'absolute',
  left: '33.33%',
  top: '33.33%',
  backgroundColor: 'rgba(128, 128, 128, 0.05)',
  padding: '4px 8px'
}

const info: CSSProperties = { display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%', alignItems: 'center' }

const Demo = () => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const debouncedScrollCallback = useDebounceCallback((params: UseScrollCallbackParams) => setScroll({ x: Math.floor(params.x), y: Math.floor(params.y) }), 100);
  const [scrollRef, scrolling] = useScroll<HTMLDivElement>(debouncedScrollCallback);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10 }} >
        <div ref={scrollRef} style={container}>
          <div style={inner}>
            <div style={topLeft}>TopLeft</div>
            <div style={bottomLeft}>BottomLeft</div>
            <div style={topRight}>TopRight</div>
            <div style={bottomRight}>BottomRight</div>
            <div style={center}>Scroll Me</div>
          </div>
        </div>

        <div style={info}>
          <div>
            <b>Scroll position:</b>
            <div>scrolling: <code>{String(scrolling)}</code></div>
            <div>x: <code>{scroll.x}</code></div>
            <div>y: <code>{scroll.y}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
