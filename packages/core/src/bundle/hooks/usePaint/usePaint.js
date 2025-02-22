import { useEffect, useRef, useState } from 'react';
import { getElement } from '@/utils/helpers';
import { useEvent } from '../useEvent/useEvent';
import { Paint } from './helpers/Paint';
const DEFAULT_BRUSH_RADIUS = 10;
/**
 * @name usePaint
 * @description - Hook that allows you to draw in a specific area
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to be painted
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn} An object containing the current pencil options and functions to interact with the paint
 *
 * @example
 * const drawing = usePaint(canvasRef);
 *
 * @overload
 * @param {UsePaintOptions} [options] The options to be used
 * @returns {UsePaintReturn & { ref: RefObject<HTMLCanvasElement> }} An object containing the current pencil options and functions to interact with the paint
 *
 * @example
 * const { ref, drawing } = usePaint();
 */
export const usePaint = ((...params) => {
    const target = (typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]);
    const options = (target ? params[1] : params[0]);
    const color = options?.color ?? 'black';
    const opacity = options?.opacity ?? 1;
    const radius = options?.radius ?? DEFAULT_BRUSH_RADIUS;
    const paintRef = useRef(new Paint({
        x: 0,
        y: 0,
        radius: options?.radius ?? DEFAULT_BRUSH_RADIUS,
        smooth: options?.smooth ?? false
    }));
    const [drawing, setIsDrawing] = useState(false);
    const internalRef = useRef(null);
    const contextRef = useRef(null);
    const draw = (points, color, opacity, radius) => {
        if (!contextRef.current)
            return;
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
        if (!contextRef.current)
            return;
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
    };
    const onMouseMove = useEvent((event) => {
        if (!drawing)
            return;
        options?.onMouseMove?.(event, paintRef.current);
        const point = { x: event.offsetX, y: event.offsetY };
        const isUpdated = paintRef.current.update(point);
        if (!isUpdated)
            return;
        if (!contextRef.current)
            return;
        clearCanvas();
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
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
        paintRef.current.lines.forEach(({ points, color, opacity, radius }) => draw(points, color, opacity, radius));
        draw(paintRef.current.points, color, opacity, radius);
    });
    const onMouseDown = useEvent((event) => {
        if (!contextRef.current)
            return;
        const point = { x: event.offsetX, y: event.offsetY };
        paintRef.current.brush.update(point);
        paintRef.current.points.push(point);
        draw(paintRef.current.points, color, opacity, radius);
        options?.onMouseDown?.(event, paintRef.current);
        setIsDrawing(true);
    });
    const onMouseUp = useEvent((event) => {
        if (!contextRef.current)
            return;
        if (paintRef.current.points.length) {
            paintRef.current.lines.push({ points: paintRef.current.points, color, opacity, radius });
            paintRef.current.points = [];
        }
        options?.onMouseUp?.(event, paintRef.current);
        setIsDrawing(false);
    });
    const clear = () => {
        if (!contextRef.current)
            return;
        clearCanvas();
        paintRef.current.lines = [];
        paintRef.current.points = [];
    };
    const undo = () => {
        if (!contextRef.current)
            return;
        clearCanvas();
        paintRef.current.lines.pop();
        paintRef.current.lines.forEach(({ points, color, opacity, radius }) => draw(points, color, opacity, radius));
    };
    useEffect(() => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        contextRef.current = element.getContext('2d');
        if (options?.initialLines) {
            paintRef.current.lines = options.initialLines;
            options.initialLines.forEach(({ points, color, opacity, radius }) => draw(points, color, opacity, radius));
        }
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseup', onMouseUp);
        return () => {
            if (!element)
                return;
            element.removeEventListener('mousedown', onMouseDown);
            element.removeEventListener('mousemove', onMouseMove);
            element.removeEventListener('mouseup', onMouseUp);
        };
    }, []);
    if (target)
        return { drawing, clear, undo, draw, lines: paintRef.current.lines };
    return { ref: internalRef, drawing, clear, undo, draw, lines: paintRef.current.lines };
});
