import type { Point } from './Pointer';
import { Pointer } from './Pointer';

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
