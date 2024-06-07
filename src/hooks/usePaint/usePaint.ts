import React from 'react';

export interface UsePaintReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  endDrawing: () => void;
  drawLine: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  setPencilWidth: (width: number) => void;
  setPencilOpacity: (opacity: number) => void;
  setPencilColor: (width: string | CanvasGradient | CanvasPattern) => void;
  clearCanvas: () => void;
}

export interface UsePaintParams {
  canvasOptions?: CanvasOptions;
  pencilOptions?: PencilOptions;
}

export type CanvasOptions = {
  width?: number;
  height?: number;
  bgColor?: string;
};

export type PencilOptions = {
  color?: string;
  width?: number;
};

const defaultWidth = 200;
const defaultHeight = defaultWidth;

/**
 * @name usePaint
 * @description - Hook that allows you to draw in a specific area
 *
 * @param {UsePaintParams} options - Optional properties for customizing the canvas and pencil.
 * 
 * @param {CanvasOptions} options.canvasOptions - Optional properties for customizing the canvas.
 * @param {number} options.canvasOptions.width - Optional width of the canvas. Defaults to 800.
 * @param {number} options.canvasOptions.height - Optional height of the canvas. Defaults to width / 1.77.
 * @param {string} options.canvasOptions.bgColor - Optional background color of the canvas. Defaults to '#fff'.
 * 
 * @param {PencilOptions} options.pencilOptions - Optional properties for customizing the pencil.
 * @param {string} options.pencilOptions.color - Optional color of the pencil. Defaults to '#000'.
 * @param {number} options.pencilOptions.width - Optional width of the pencil. Defaults to 5.
 * @returns {UsePaintReturn} - Object containing the canvas reference, function to set the pencil color, and the currently selected pencil color.
 * 
 * @example
 * const {
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
      bgColor: '#fff'
    }
  });
 */

export const usePaint = (options: UsePaintParams = {}): UsePaintReturn => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [lineWidth, setLineWidth] = React.useState(options?.pencilOptions?.width || 5);
  const [lineColor, setLineColor] = React.useState<string | CanvasGradient | CanvasPattern>(
    options?.pencilOptions?.color || 'black'
  );
  const [lineOpacity, setLineOpacity] = React.useState(0.1);

  const setPencilWidth = (width: number) => {
    setLineWidth(width);
  };

  const setPencilColor = (color: string | CanvasGradient | CanvasPattern) => {
    setLineColor(color);
  };

  const setPencilOpacity = (opacity: number) => {
    setLineOpacity(opacity);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!ctxRef.current) return;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const endDrawing = () => {
    if (!ctxRef.current) return;

    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const drawLine = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing || !ctxRef.current) return;

    ctxRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = options?.canvasOptions?.bgColor || '#fff';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = options?.canvasOptions?.width || defaultWidth;
    canvas.height = options?.canvasOptions?.height || defaultHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = options?.canvasOptions?.bgColor || '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [
    options?.canvasOptions?.bgColor,
    options?.canvasOptions?.height,
    options?.canvasOptions?.width
  ]);

  return {
    canvasRef,
    startDrawing,
    endDrawing,
    drawLine,
    setPencilWidth,
    setPencilColor,
    setPencilOpacity,
    clearCanvas
  };
};
