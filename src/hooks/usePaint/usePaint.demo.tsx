import { useKeyPressEvent } from '../useKeyPressEvent/useKeyPressEvent';

import { usePaint } from './usePaint';

const Demo = () => {
  const { ref, pencil, drawing } = usePaint({ width: 10, color: '#e63946' });

  const clearCanvas = () => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.globalAlpha = 1;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  useKeyPressEvent('c', clearCanvas);

  return (
    <>
      <p>
        Status: <code>{drawing ? 'drawing' : 'not drawing'}</code>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <label>Color</label>
          <input
            type='color'
            value={pencil.color}
            onChange={(event) => pencil.set({ color: event.target.value })}
          />
        </div>
        <div>
          <label>Width</label>
          <input
            min='3'
            max='20'
            type='range'
            value={pencil.width}
            onChange={(event) => pencil.set({ width: Number(event.target.value) })}
          />
        </div>
      </div>

      <canvas width={400} height={400} ref={ref} style={{ backgroundColor: 'white' }} />
      <br />

      <button type='button' onClick={clearCanvas}>
        Clear
      </button>

      <p>
        or press key <code>c</code> to clear
      </p>
    </>
  );
};

export default Demo;
