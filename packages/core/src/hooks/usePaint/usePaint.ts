import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';

const DEFAULT_BRUSH_RADIUS = 10;

export interface Point {
  x: number;
  y: number;
}

export class Pointer implements Point {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(point: Point) {
    this.x = point.x;
    this.y = point.y;
  }

  getDifferenceTo(point: Point) {
    return new Pointer(this.x - point.x, this.y - point.y);
  }

  getDistanceTo(point: Point) {
    const diff = this.getDifferenceTo(point);
    return Math.sqrt(diff.x ** 2 + diff.y ** 2);
  }

  getAngleTo(point: Point) {
    const diff = this.getDifferenceTo(point);
    return Math.atan2(diff.y, diff.x);
  }

  equalsTo(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  moveByAngle(
    // The angle in radians
    angle: number,
    // How much the point should be moved
    distance: number
  ) {
    // Rotate the angle based on the browser coordinate system ([0,0] in the top left)
    const angleRotated = angle + Math.PI / 2;

    this.x += Math.sin(angleRotated) * distance;
    this.y -= Math.cos(angleRotated) * distance;

    return this;
  }
}

export class Paint {
  pointer: Pointer;

  brush: Pointer;

  radius: number;

  smooth: boolean = false;

  points: Point[] = [];

  lines: { points: Point[]; color: string; radius: number; opacity: number }[] = [];

  constructor({ x, y, radius, smooth }: { x: number; y: number; radius: number; smooth: boolean }) {
    this.smooth = smooth;
    this.pointer = new Pointer(x, y);
    this.brush = new Pointer(x, y);
    this.radius = radius;
    this.points = [];
    this.lines = [];
  }

  getBrushCoordinates() {
    return {
      x: this.brush.x,
      y: this.brush.y
    };
  }

  getPointerCoordinates() {
    return {
      x: this.pointer.x,
      y: this.pointer.y
    };
  }

  update(point: Point) {
    if (this.pointer.equalsTo(point)) return false;
    this.pointer.update(point);

    if (!this.smooth) {
      this.brush.update(point);
      this.points.push(this.getBrushCoordinates());
      return true;
    }

    const distance = this.pointer.getDistanceTo(this.brush);
    const angle = this.pointer.getAngleTo(this.brush);
    const isOutside = Math.round((distance - this.radius) * 10) / 10 > 0;

    if (isOutside) {
      const angleRotated = angle + Math.PI / 2;
      this.brush.update({
        x: this.brush.x + Math.sin(angleRotated) * (distance - this.radius),
        y: this.brush.y - Math.cos(angleRotated) * (distance - this.radius)
      });
      this.points.push(this.getBrushCoordinates());
      return true;
    }

    return false;
  }
}

export interface UsePaintOptions {
  /** Brush color */
  color?: string;
  /** Initial lines */
  initialLines?: Paint['lines'];
  /** Brush opacity */
  opacity?: number;
  /** Brush radius */
  radius?: number;
  /** Smooth brush movement */
  smooth?: boolean;
  /** Callback when the mouse is down */
  onMouseDown?: (event: MouseEvent, paint: Paint) => void;
  /** Callback when the mouse is moved */
  onMouseMove?: (event: MouseEvent, paint: Paint) => void;
  /** Callback when the mouse is up */
  onMouseUp?: (event: MouseEvent, paint: Paint) => void;
}

export interface UsePaintReturn {
  drawing: boolean;
  lines: Paint['lines'];
  clear: () => void;
  draw: (points: Point[], color: string, opacity: number, radius: number) => void;
  undo: () => void;
}

export interface UsePaint {
  (target: HookTarget, options?: UsePaintOptions): UsePaintReturn;

  <Target extends HTMLCanvasElement>(
    options?: UsePaintOptions,
    target?: never
  ): UsePaintReturn & { ref: StateRef<Target> };
}

/**
 * @name usePaint
 * @description - Hook that allows you to draw in a specific area
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to be painted
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn} An object containing the current pencil options and functions to interact with the paint
 *
 * @example
 * const drawing = usePaint(canvasRef);
 *
 * @overload
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn & { ref: StateRef<HTMLCanvasElement> }} An object containing the current pencil options and functions to interact with the paint
 *
 * @example
 * const { ref, drawing } = usePaint();
 */
export const usePaint = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UsePaintOptions) ?? {};

  const color = options?.color ?? 'black';
  const opacity = options?.opacity ?? 1;
  const radius = options?.radius ?? DEFAULT_BRUSH_RADIUS;

  const paintRef = useRef<Paint>(
    new Paint({
      x: 0,
      y: 0,
      radius: options?.radius ?? DEFAULT_BRUSH_RADIUS,
      smooth: options?.smooth ?? false
    })
  );
  const [drawing, setIsDrawing] = useState(false);
  const internalRef = useRefState<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const draw = (points: Point[], color: string, opacity: number, radius: number) => {
    if (!contextRef.current) return;

    contextRef.current.globalAlpha = opacity;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = radius * 2;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';

    let p1 = points[0];
    let p2 = points[1];

    contextRef.current.beginPath();

    for (let i = 1; i < points.length; i += 1) {
      const midPoint = {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
      };
      contextRef.current.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i + 1];
    }
    contextRef.current.lineTo(p1.x, p1.y);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    if (!contextRef.current) return;
    contextRef.current.clearRect(
      0,
      0,
      contextRef.current.canvas.width,
      contextRef.current.canvas.height
    );
  };

  const onMouseMove = useEvent((event: MouseEvent) => {
    if (!drawing) return;
    options?.onMouseMove?.(event, paintRef.current);

    const point = { x: event.offsetX, y: event.offsetY };

    const isUpdated = paintRef.current.update(point);

    if (!isUpdated) return;
    if (!contextRef.current) return;
    clearCanvas();
    contextRef.current.clearRect(
      0,
      0,
      contextRef.current.canvas.width,
      contextRef.current.canvas.height
    );

    // const brush = paintRef.current.getBrushCoordinates();
    // // Draw brush point
    // contextRef.current.beginPath();
    // contextRef.current.fillStyle = 'red';
    // contextRef.current.arc(brush.x, brush.y, radius, 0, Math.PI * 2, true);
    // contextRef.current.fill();

    // // Draw the lazy radius.
    // contextRef.current.beginPath();
    // contextRef.current.strokeStyle = '#ccc';
    // contextRef.current.arc(brush.x, brush.y, radius * 2, 0, Math.PI * 2, true);
    // contextRef.current.stroke();

    paintRef.current.lines.forEach(({ points, color, opacity, radius }) =>
      draw(points, color, opacity, radius)
    );
    draw(paintRef.current.points, color, opacity, radius);
  });

  const onMouseDown = useEvent((event: MouseEvent) => {
    if (!contextRef.current) return;

    const point = { x: event.offsetX, y: event.offsetY };
    paintRef.current.brush.update(point);
    paintRef.current.points.push(point);
    draw(paintRef.current.points, color, opacity, radius);

    options?.onMouseDown?.(event, paintRef.current);
    setIsDrawing(true);
  });

  const onMouseUp = useEvent((event: MouseEvent) => {
    if (!contextRef.current) return;

    if (paintRef.current.points.length) {
      paintRef.current.lines.push({
        points: paintRef.current.points,
        color,
        opacity,
        radius
      });
      paintRef.current.points = [];
    }

    options?.onMouseUp?.(event, paintRef.current);
    setIsDrawing(false);
  });

  const clear = () => {
    if (!contextRef.current) return;
    clearCanvas();
    paintRef.current.lines = [];
    paintRef.current.points = [];
  };

  const undo = () => {
    if (!contextRef.current) return;
    clearCanvas();

    paintRef.current.lines.pop();
    paintRef.current.lines.forEach(({ points, color, opacity, radius }) =>
      draw(points, color, opacity, radius)
    );
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLCanvasElement;
    if (!element) return;
    contextRef.current = element.getContext('2d');

    if (options?.initialLines) {
      paintRef.current.lines = options.initialLines;
      options.initialLines.forEach(({ points, color, opacity, radius }) =>
        draw(points, color, opacity, radius)
      );
    }

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    return () => {
      if (!element) return;
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
    };
  }, [target, internalRef.state, isTarget.getRefState(target)]);

  if (target) return { drawing, clear, undo, draw, lines: paintRef.current.lines };
  return {
    ref: internalRef,
    drawing,
    clear,
    undo,
    draw,
    lines: paintRef.current.lines
  };
}) as UsePaint;
