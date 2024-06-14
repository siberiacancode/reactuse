import React from 'react';

import { usePaint } from './usePaint';

const Demo = () => {
  const {
    canvasRef,
    startDrawing,
    endDrawing,
    drawLine,
    setPencilWidth,
    setPencilOpacity,
    setPencilColor,
    clearCanvas,
    pencilColor,
    pencilWidth,
    pencilOpacity
  } = usePaint({
    pencilOptions: { width: 10, color: '#e63946', opacity: 0.1 },
    canvasOptions: {
      bgColor: '#fff',
      width: 400,
      height: 300
    }
  });

  const {
    canvasRef: canvasRef2,
    startDrawing: startDrawing2,
    endDrawing: endDrawing2,
    drawLine: drawLine2,
    clearCanvas: clearCanvas2
  } = usePaint({
    pencilOptions: { width: 10, color: '#e63946' },
    canvasOptions: {
      bgColor: '#fff',
      width: 400,
      height: 300
    }
  });

  const clearCanvasHandler = (event: KeyboardEvent) => {
    if (event.key === 'c') {
      clearCanvas2();
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef2.current;
    if (!canvas) return;

    window.addEventListener('keydown', clearCanvasHandler);

    return () => {
      window.removeEventListener('keydown', clearCanvasHandler);
    };
  }, [canvasRef]);

  const downloadImage = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas.png';
    link.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <label>Brush Color</label>
          <input
            value={pencilColor}
            type='color'
            onChange={(event) => {
              setPencilColor(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Brush Width</label>
          <input
            value={pencilWidth}
            type='range'
            min='3'
            max='20'
            onChange={(event) => {
              setPencilWidth(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <label>Brush Opacity</label>
          <input
            value={pencilOpacity}
            type='range'
            min='0'
            max='1'
            step='0.01'
            onChange={(event) => {
              setPencilOpacity(Number(event.target.value));
            }}
          />
        </div>
      </div>
      <button type='button' onClick={clearCanvas}>
        Clear
      </button>
      <button type='button' onClick={downloadImage}>
        Download image
      </button>
      <p>Pencil color: {pencilColor}</p>
      <p>Pencil width: {pencilWidth}</p>
      <p>Pencil opacity: {pencilOpacity}</p>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={drawLine}
        ref={canvasRef}
      />

      <hr />

      <p>Press button &apos;c&apos; to clear</p>
      <canvas
        onMouseDown={startDrawing2}
        onMouseUp={endDrawing2}
        onMouseMove={drawLine2}
        ref={canvasRef2}
      />
    </div>
  );
};

export default Demo;
