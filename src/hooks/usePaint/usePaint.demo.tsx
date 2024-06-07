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
    clearCanvas
  } = usePaint({
    pencilOptions: { width: 10, color: '#e63946' },
    canvasOptions: {
      bgColor: '#fff',
      width: 400,
      height: 300
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <label>Brush Color</label>
          <input
            type='color'
            onChange={(event) => {
              setPencilColor(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Brush Width</label>
          <input
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
            type='range'
            min='1'
            max='100'
            onChange={(event) => {
              setPencilOpacity(Number(event.target.value) / 100);
            }}
          />
        </div>
      </div>
      <button type='button' onClick={clearCanvas}>
        Clear
      </button>
      <p>Paint here</p>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={drawLine}
        ref={canvasRef}
      />
    </div>
  );
};

export default Demo;
