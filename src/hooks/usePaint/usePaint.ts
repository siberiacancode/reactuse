import React from 'react';

import { useEvent } from '../useEvent/useEvent';

export interface UsePaintPencil {
  /** Pencil color */
  color?: string;
  /** Pencil width */
  width?: number;
}

export type UsePaintOptions = UsePaintPencil;

/** The use paint return type */
export interface UsePaintReturn {
  pencil: UsePaintPencil & { set: React.Dispatch<React.SetStateAction<UsePaintPencil>> };
}

export type UsePaintTarget =
  | React.RefObject<HTMLCanvasElement>
  | (() => HTMLCanvasElement)
  | HTMLCanvasElement;

export const getTargetElement = (target: UsePaintTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

export type UsePaint = {
  <Target extends UsePaintTarget>(target: Target, options?: UsePaintOptions): UsePaintReturn;

  (
    options?: UsePaintOptions,
    target?: never
  ): UsePaintReturn & { ref: React.RefObject<HTMLCanvasElement> };
};

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
 * @param {number} options.pencilOptions.opacity - Optional opacity of the pencil. Defaults to 0.1.
 * @returns {UsePaintReturn} - Object containing the canvas reference, function to set the pencil color, pencil width, pencil opacity and function to clear the canvas.
 *
 * @example
 * const { pencil, set } = usePaint(canvasRef);
 */

export const usePaint = ((...params: any[]) => {
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UsePaintTarget | undefined;
  const options = (target ? params[1] : params[0]) as UsePaintOptions | undefined;

  const [isDrawing, setIsDrawing] = React.useState(false);
  const internalRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const [pencil, setPencil] = React.useState({
    width: options?.width ?? 5,
    color: options?.color ?? 'black'
  });

  const onMouseMove = useEvent((event: MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;
    contextRef.current.lineTo(event.offsetX, event.offsetY);
    contextRef.current.stroke();
  });

  React.useEffect(() => {
    const element = target ? getTargetElement(target) : internalRef.current;
    if (!element) return;
    contextRef.current = element.getContext('2d');

    const onMouseDown = (event: MouseEvent) => {
      if (!contextRef.current) return;
      contextRef.current.beginPath();
      contextRef.current.moveTo(event.offsetX, event.offsetY);
      setIsDrawing(true);
    };

    const onMouseUp = () => {
      if (!contextRef.current) return;
      contextRef.current.closePath();
      setIsDrawing(false);
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    return () => {
      if (!element) return;
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  React.useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = pencil.color;
    contextRef.current.lineWidth = pencil.width;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';
  }, [pencil.color, pencil.width]);

  if (target) return { pencil: { ...pencil, set: setPencil } };
  return { pencil: { ...pencil, set: setPencil }, ref: internalRef };
}) as UsePaint;
