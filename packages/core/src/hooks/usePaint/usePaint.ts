import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

const DEFAULT_BRUSH_RADIUS = 10;
const DEFAULT_COLOR = 'black';
const DEFAULT_OPACITY = 1;

/** The point type */
export interface Point {
  x: number;
  y: number;
}

/** The pointer class that represents a coordinate */
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

  moveByAngle(angle: number, distance: number) {
    const angleRotated = angle + Math.PI / 2;
    this.x += Math.sin(angleRotated) * distance;
    this.y -= Math.cos(angleRotated) * distance;
    return this;
  }
}

/** The line type */
export interface Line {
  color: string;
  opacity: number;
  points: Point[];
  radius: number;
}

/** The paint class that handles the drawing engine */
export class Paint {
  pointer: Pointer;

  brush: Pointer;

  radius: number;

  smooth: boolean = false;

  points: Point[] = [];

  lines: Line[] = [];

  constructor({
    x,
    y,
    radius,
    smooth,
    lines = []
  }: {
    x: number;
    y: number;
    radius: number;
    smooth: boolean;
    lines?: Line[];
  }) {
    this.smooth = smooth;
    this.pointer = new Pointer(x, y);
    this.brush = new Pointer(x, y);
    this.radius = radius;
    this.points = [];
    this.lines = lines;
  }

  getBrushCoordinates() {
    return { x: this.brush.x, y: this.brush.y };
  }

  getPointerCoordinates() {
    return { x: this.pointer.x, y: this.pointer.y };
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

/** The use paint initial value type */
export interface UsePaintInitialValue {
  /** The initial brush color */
  color?: string;
  /** The initial lines */
  lines?: Line[];
  /** The initial brush opacity */
  opacity?: number;
  /** The initial brush radius */
  radius?: number;
}

/** The use paint options type */
export interface UsePaintOptions {
  /** Whether the brush movement is smooth */
  smooth?: boolean;
  /** The callback when the mouse is down */
  onMouseDown?: (event: MouseEvent, paint: Paint) => void;
  /** The callback when the mouse is moved */
  onMouseMove?: (event: MouseEvent, paint: Paint) => void;
  /** The callback when the mouse is up */
  onMouseUp?: (event: MouseEvent, paint: Paint) => void;
}

/** The use paint return type */
export interface UsePaintReturn {
  /** Whether redo is available */
  canRedo: boolean;
  /** Whether undo is available */
  canUndo: boolean;
  /** The current brush color */
  color: string;
  /** Whether the user is drawing */
  drawing: boolean;
  /** The current lines */
  lines: Line[];
  /** The current brush opacity */
  opacity: number;
  /** The current brush radius */
  radius: number;
  /** Changes the brush color */
  changeColor: (color: string) => void;
  /** Changes the brush opacity */
  changeOpacity: (opacity: number) => void;
  /** Changes the brush radius */
  changeRadius: (radius: number) => void;
  /** Clears the canvas */
  clear: () => void;
  /** Draws a line */
  draw: (line: Line) => void;
  /** Redoes the last undone line */
  redo: () => void;
  /** Undoes the last line */
  undo: () => void;
}

export interface UsePaint {
  (
    target: HookTarget,
    initialValue?: UsePaintInitialValue,
    options?: UsePaintOptions
  ): UsePaintReturn;

  <Target extends HTMLCanvasElement>(
    initialValue?: UsePaintInitialValue,
    options?: UsePaintOptions
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
 * @param {UsePaintInitialValue} [initialValue] The initial value of the paint
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn} An object containing the current brush state and functions to interact with the paint
 *
 * @example
 * const paint = usePaint(canvasRef, { color: 'red', radius: 10 });
 *
 * @overload
 * @param {UsePaintInitialValue} [initialValue] The initial value of the paint
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn & { ref: StateRef<HTMLCanvasElement> }} An object containing the current brush state and functions to interact with the paint
 *
 * @example
 * const { ref, draw, clear, undo, redo, changeColor } = usePaint({ color: 'red', radius: 10 }, { smooth: true });
 */
export const usePaint = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const initialValue = ((target ? params[1] : params[0]) as UsePaintInitialValue) ?? {};
  const options = ((target ? params[2] : params[1]) as UsePaintOptions) ?? {};

  const initialLinesRef = useRef(initialValue.lines ?? []);

  const [color, setColor] = useState(initialValue.color ?? DEFAULT_COLOR);
  const [radius, setRadius] = useState(initialValue.radius ?? DEFAULT_BRUSH_RADIUS);
  const [opacity, setOpacity] = useState(initialValue.opacity ?? DEFAULT_OPACITY);
  const [drawing, setDrawing] = useState(false);
  const [canUndo, setCanUndo] = useState(!!initialLinesRef.current.length);
  const [canRedo, setCanRedo] = useState(false);

  const paintRef = useRef<Paint>(
    new Paint({
      x: 0,
      y: 0,
      radius: initialValue.radius ?? DEFAULT_BRUSH_RADIUS,
      smooth: options.smooth ?? false,
      lines: initialLinesRef.current
    })
  );

  const internalRef = useRefState<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const redoStackRef = useRef<Line[]>([]);

  /** Mirrors current values so the mount-only listeners always read fresh data */
  const stateRef = useRef({ color, radius, opacity, drawing, options });
  stateRef.current = { color, radius, opacity, drawing, options };

  const draw = (line: Line) => {
    if (!contextRef.current) return;
    if (!line.points.length) return;

    contextRef.current.globalAlpha = line.opacity;
    contextRef.current.strokeStyle = line.color;
    contextRef.current.lineWidth = line.radius * 2;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';

    let p1 = line.points[0];
    let p2 = line.points[1];

    contextRef.current.beginPath();
    contextRef.current.moveTo(p1.x, p1.y);

    for (let i = 1; i < line.points.length; i += 1) {
      const midPoint = {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
      };
      contextRef.current.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = line.points[i];
      p2 = line.points[i + 1];
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

  const render = () => {
    clearCanvas();
    paintRef.current.lines.forEach((line) => draw(line));
    if (paintRef.current.points.length) {
      const { color, radius, opacity } = stateRef.current;
      draw({ points: paintRef.current.points, color, radius, opacity });
    }
  };

  const finalizeStroke = () => {
    if (!paintRef.current.points.length) return;
    const { color, radius, opacity } = stateRef.current;
    paintRef.current.lines.push({
      points: paintRef.current.points,
      color,
      radius,
      opacity
    });
    paintRef.current.points = [];
    redoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const changeColor = (color: string) => setColor(color);

  const changeOpacity = (opacity: number) => setOpacity(opacity);

  const changeRadius = (radius: number) => {
    paintRef.current.radius = radius;
    setRadius(radius);
  };

  const clear = () => {
    if (!contextRef.current) return;
    clearCanvas();
    paintRef.current.lines = [];
    paintRef.current.points = [];
    redoStackRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  };

  const undo = () => {
    if (!contextRef.current) return;
    const line = paintRef.current.lines.pop();
    if (!line) return;
    redoStackRef.current.push(line);
    render();
    setCanUndo(!!paintRef.current.lines.length);
    setCanRedo(true);
  };

  const redo = () => {
    if (!contextRef.current) return;
    const line = redoStackRef.current.pop();
    if (!line) return;
    paintRef.current.lines.push(line);
    render();
    setCanUndo(true);
    setCanRedo(!!redoStackRef.current.length);
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLCanvasElement;
    if (!element) return;

    contextRef.current = element.getContext('2d');

    const resize = () => {
      if (!contextRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = element.getBoundingClientRect();

      element.width = rect.width * dpr;
      element.height = rect.height * dpr;
      contextRef.current.scale(dpr, dpr);

      render();
    };

    paintRef.current.lines = initialLinesRef.current;
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(element);

    const onMouseDown = (event: MouseEvent) => {
      if (!contextRef.current) return;
      const point = { x: event.offsetX, y: event.offsetY };
      paintRef.current.brush.update(point);
      paintRef.current.points.push(point);
      render();
      stateRef.current.options.onMouseDown?.(event, paintRef.current);
      setDrawing(true);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!stateRef.current.drawing) return;
      stateRef.current.options.onMouseMove?.(event, paintRef.current);

      const point = { x: event.offsetX, y: event.offsetY };
      const isUpdated = paintRef.current.update(point);
      if (!isUpdated) return;
      render();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (!contextRef.current) return;
      finalizeStroke();
      stateRef.current.options.onMouseUp?.(event, paintRef.current);
      setDrawing(false);
    };

    const onMouseEnter = (event: MouseEvent) => {
      if (event.buttons !== 1) return;
      if (!contextRef.current) return;
      const point = { x: event.offsetX, y: event.offsetY };
      paintRef.current.brush.update(point);
      paintRef.current.points.push(point);
      render();
      stateRef.current.options.onMouseDown?.(event, paintRef.current);
      setDrawing(true);
    };

    const onMouseLeave = (event: MouseEvent) => {
      if (!stateRef.current.drawing) return;
      finalizeStroke();
      stateRef.current.options.onMouseUp?.(event, paintRef.current);
      setDrawing(false);
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mouseenter', onMouseEnter);

    return () => {
      observer.disconnect();
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const result = {
    color,
    radius,
    opacity,
    drawing,
    canUndo,
    canRedo,
    lines: paintRef.current.lines,
    changeColor,
    changeRadius,
    changeOpacity,
    draw,
    clear,
    undo,
    redo
  };

  if (target) return result;
  return { ...result, ref: internalRef };
}) as UsePaint;
