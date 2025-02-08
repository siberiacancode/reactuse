import type { CSSProperties } from 'react';

import { register } from 'node:module';

import { useField } from '../useField/useField';
import { useToggle } from '../useToggle/useToggle';
import { useScroll } from './useScroll';

const styles: Record<string, CSSProperties> = {
  container: {
    width: '300px',
    height: '300px',
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
  const xInput = useField({ initialValue: 0 });
  const yInput = useField({ initialValue: 0 });
  const [behavior, setBehavior] = useToggle<ScrollBehavior>(['auto', 'smooth']);

  const scrollX = xInput.watch();
  const scrollY = yInput.watch();

  const scroll = useScroll<HTMLDivElement>({
    x: scrollX,
    y: scrollY,
    behavior,
    onScroll: (event) => {
      console.log('onScroll', event);
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexDirection: 'column', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>x:</span>
            <input type='number'{...xInput.register()} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>y:</span>
            <input type='number' {...yInput.register()} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            Smooth scrolling:{' '}
            <input
              type='checkbox'
              value={behavior}
              onChange={(event) => setBehavior(event.target.checked ? 'smooth' : 'auto')}
            />
          </div>
          <div>scrolling: <code>{String(scroll.scrolling)}</code></div>
        </div>
      </div>


      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        <div ref={scroll.ref} style={styles.container}>
          <div style={styles.inner}>
            <div style={styles.topLeft}>TopLeft</div>
            <div style={styles.bottomLeft}>BottomLeft</div>
            <div style={styles.topRight}>TopRight</div>
            <div style={styles.bottomRight}>BottomRight</div>
            <div style={styles.center}>Scroll Me</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 15 }}>
          <div style={{ display: 'flex', gap: 10, flexDirection: 'column', minWidth: 150 }}>
            <h4>Arrived</h4>
            <div style={{ display: 'flex', gap: 15, flexDirection: 'column' }}>
              <div>top: <code>{String(scroll.arrived.top)}</code></div>
              <div>right: <code>{String(scroll.arrived.right)}</code></div>
              <div>bottom: <code>{String(scroll.arrived.bottom)}</code></div>
              <div>left: <code>{String(scroll.arrived.left)}</code></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
            <h4>Directions</h4>
            <div style={{ display: 'flex', gap: 15, flexDirection: 'column', minWidth: 150 }}>
              <div>top: <code>{String(scroll.directions.top)}</code></div>
              <div>right: <code>{String(scroll.directions.right)}</code></div>
              <div>bottom: <code>{String(scroll.directions.bottom)}</code></div>
              <div>left: <code>{String(scroll.directions.left)}</code></div>
            </div>
          </div>
        </div>
      </div >
    </div>
  );
};

export default Demo;
