export class Pointer {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update(point) {
        this.x = point.x;
        this.y = point.y;
    }
    getDifferenceTo(point) {
        return new Pointer(this.x - point.x, this.y - point.y);
    }
    getDistanceTo(point) {
        const diff = this.getDifferenceTo(point);
        return Math.sqrt(diff.x ** 2 + diff.y ** 2);
    }
    getAngleTo(point) {
        const diff = this.getDifferenceTo(point);
        return Math.atan2(diff.y, diff.x);
    }
    equalsTo(point) {
        return this.x === point.x && this.y === point.y;
    }
    moveByAngle(
    // The angle in radians
    angle, 
    // How much the point should be moved
    distance) {
        // Rotate the angle based on the browser coordinate system ([0,0] in the top left)
        const angleRotated = angle + Math.PI / 2;
        this.x += Math.sin(angleRotated) * distance;
        this.y -= Math.cos(angleRotated) * distance;
        return this;
    }
}
