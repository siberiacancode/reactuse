import type { CSSProperties } from 'react';

import { useMemo, useRef, useState } from 'react';

import { useScroll } from './useScroll';

const styles: Record<string, CSSProperties> = {
  container: {
    width: '300px',
    height: '300px',
    margin: 'auto',
    overflow: 'scroll',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: '8px'
  },
  inner: {
    width: '500px',
    height: '400px',
    position: 'relative'
  },
  topLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: '4px 8px'
  },
  bottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: '4px 8px'
  },
  topRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: '4px 8px'
  },
  bottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: '4px 8px'
  },
  center: {
    position: 'absolute',
    left: '33.33%',
    top: '33.33%',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    padding: '4px 8px'
  },
  containerInfo: {
    width: 280,
    margin: 'auto',
    paddingLeft: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  }
};

const Demo = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [behavior, setBehavior] = useState<ScrollBehavior>('auto');

  const { x, y, isScrolling, arrivedState, directions } = useScroll(elementRef, {
    x: scrollX,
    y: scrollY,
    behavior
  });

  const { left, right, top, bottom } = useMemo(() => arrivedState, [arrivedState]);

  const {
    left: toLeft,
    right: toRight,
    top: toTop,
    bottom: toBottom
  } = useMemo(() => directions, [directions]);

  return (
    <div style={{ display: 'flex' }}>
      <div ref={elementRef} style={styles.container}>
        <div style={styles.inner}>
          <div style={styles.topLeft}>TopLeft</div>
          <div style={styles.bottomLeft}>BottomLeft</div>
          <div style={styles.topRight}>TopRight</div>
          <div style={styles.bottomRight}>BottomRight</div>
          <div style={styles.center}>Scroll Me</div>
        </div>
      </div>
      <div style={styles.containerInfo}>
        <div>
          X Position:
          <input value={x} onChange={(event) => setScrollX(+event.target.value)} />
        </div>
        <div>
          Y Position:
          <input value={y} onChange={(event) => setScrollY(+event.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          Smooth scrolling:{' '}
          <input
            type='checkbox'
            value={behavior}
            onChange={(event) => setBehavior(event.target.checked ? 'smooth' : 'auto')}
          />
        </div>
        <div>isScrolling: {JSON.stringify(isScrolling)}</div>
        <div>Top Arrived: {JSON.stringify(top)}</div>
        <div>Right Arrived: {JSON.stringify(right)}</div>
        <div>Bottom Arrived: {JSON.stringify(bottom)}</div>
        <div>Left Arrived: {JSON.stringify(left)}</div>
        <div>Scrolling Up: {JSON.stringify(toTop)}</div>
        <div>Scrolling Right: {JSON.stringify(toRight)}</div>
        <div>Scrolling Down: {JSON.stringify(toBottom)}</div>
        <div>Scrolling Left: {JSON.stringify(toLeft)}</div>
      </div>
    </div>
  );
};

export default Demo;
