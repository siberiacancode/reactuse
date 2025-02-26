import { useState } from 'react';

import type { Paint } from './helpers/Paint';

import { useField } from '../useField/useField';
import { useInterval } from '../useInterval/useInterval';
import { useKeyPressEvent } from '../useKeyPressEvent/useKeyPressEvent';
import { usePaint } from './usePaint';

const Demo = () => {
  const [color, setColor] = useState('#37d2e6');
  const radiusInput = useField({ initialValue: '10' });
  const opacityInput = useField({ initialValue: '1' });

  const radius = radiusInput.watch();
  const opacity = opacityInput.watch();

  const paint = usePaint({
    radius: Number(radius),
    color,
    smooth: true,
    opacity: Number(opacity),
    initialLines: JSON.parse(localStorage.getItem('lines') || '[]') as Paint['lines'],
    onMouseUp: (_event, paint) => localStorage.setItem('lines', JSON.stringify(paint.lines))
  });

  useInterval(() => setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`), 1000, {
    enabled: paint.drawing
  });

  useKeyPressEvent('c', paint.clear);
  useKeyPressEvent('u', paint.undo);

  return (
    <>
      <p>
        Status: <code>{paint.drawing ? 'drawing' : 'not drawing'}</code>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p>
          Color: <code>{color}</code>
        </p>

        <div>
          <label>Opacity</label>
          <input max='1' min='0' step='0.1' type='range' {...opacityInput.register()} />
        </div>
        <div>
          <label>Radius</label>
          <input max='20' min='3' type='range' {...radiusInput.register()} />
        </div>
      </div>

      <canvas ref={paint.ref} height='500' style={{ backgroundColor: 'white' }} width='500' />
      <br />
      <p>
        press key <code>c</code> to clear
      </p>
      <p>
        press key <code>u</code> to undo
      </p>
    </>
  );
};

export default Demo;
