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
