import { useState } from 'react';

import { useField } from '../useField/useField';
import { useInterval } from '../useInterval/useInterval';
import { useKeyPressEvent } from '../useKeyPressEvent/useKeyPressEvent';

import type { Paint } from './helpers/Paint';
import { usePaint } from './usePaint';

// мобильное устройство

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
          <input min='0' max='1' step='0.1' type='range' {...opacityInput.register()} />
        </div>
        <div>
          <label>Radius</label>
          <input min='3' max='20' type='range' {...radiusInput.register()} />
        </div>
      </div>

      <canvas ref={paint.ref} width='500' height='500' style={{ backgroundColor: 'white' }} />
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
