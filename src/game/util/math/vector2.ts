export class Vector2 {
    public constructor(public x: number, public y: number) {
    }

    public add(...args: (number | Vector2)[]): Vector2 {
        let x = this.x;
        let y = this.y;

        for (const arg of args) {
            if (typeof arg === 'number') {
                x += arg;
                y += arg;
            } else {
                x += arg.x;
                y += arg.y;
            }
        }
        return new Vector2(x, y);
    }

    public subtract(...args: (number | Vector2)[]): Vector2 {
        let x = this.x;
        let y = this.y;

        for (const arg of args) {
            if (typeof arg === 'number') {
                x -= arg;
                y -= arg;
            } else {
                x -= arg.x;
                y -= arg.y;
            }
        }
        return new Vector2(x, y);
    }

    public multiply(...args: (number | Vector2)[]): Vector2 {
        let x = this.x;
        let y = this.y;

        for (const arg of args) {
            if (typeof arg === 'number') {
                x *= arg;
                y *= arg;
            } else {
                x *= arg.x;
                y *= arg.y;
            }
        }
        return new Vector2(x, y);
    }

    public divide(...args: (number | Vector2)[]): Vector2 {
        let x = this.x;
        let y = this.y;

        for (const arg of args) {
            if (typeof arg === 'number') {
                x /= arg;
                y /= arg;
            } else {
                x /= arg.x;
                y /= arg.y;
            }
        }
        return new Vector2(x, y);
    }

    public angle(): number {
        const mag = this.magnitude();
        if (mag === 0) return 0;
        return (Math.atan2(this.y, this.x) * 180) / Math.PI;
    }

    public angleRadians(): number {
        const mag = this.magnitude();
        if (mag === 0) return 0;
        return Math.atan2(this.y, this.x);
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public rotate(angleDegrees: number): Vector2 {
        return this.rotateRadians((angleDegrees * Math.PI) / 180);
    }

    public rotateRadians(angleRadians: number): Vector2 {
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    public floor(): Vector2;
    public floor(value: number): Vector2;
    public floor(x: number, y: number): Vector2;
    public floor(vector: Vector2): Vector2;
    public floor(arg1?: number | Vector2, arg2?: number): Vector2 {
        if (arg1 === undefined) {
            return new Vector2(Math.floor(this.x), Math.floor(this.y));
        } else if (typeof arg1 === 'number' && arg2 !== undefined) {
            return new Vector2(Math.floor(this.x / arg1) * arg1, Math.floor(this.y / arg2) * arg2);
        } else if (typeof arg1 === 'number') {
            return new Vector2(Math.floor(this.x / arg1) * arg1, Math.floor(this.y / arg1) * arg1);
        } else {
            return new Vector2(Math.floor(this.x / arg1.x) * arg1.x, Math.floor(this.y / arg1.y) * arg1.y);
        }
    }

    public ceil(): Vector2;
    public ceil(value: number): Vector2;
    public ceil(x: number, y: number): Vector2;
    public ceil(vector: Vector2): Vector2;
    public ceil(arg1?: number | Vector2, arg2?: number): Vector2 {
        if (arg1 === undefined) {
            return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
        } else if (typeof arg1 === 'number' && arg2 !== undefined) {
            return new Vector2(Math.ceil(this.x / arg1) * arg1, Math.ceil(this.y / arg2) * arg2);
        } else if (typeof arg1 === 'number') {
            return new Vector2(Math.ceil(this.x / arg1) * arg1, Math.ceil(this.y / arg1) * arg1);
        } else {
            return new Vector2(Math.ceil(this.x / arg1.x) * arg1.x, Math.ceil(this.y / arg1.y) * arg1.y);
        }
    }

    // Clamp methods with overloads
    public clamp(min: number, max: number): Vector2;
    public clamp(min: Vector2, max: Vector2): Vector2;
    public clamp(minArg: number | Vector2, maxArg: number | Vector2): Vector2 {
        if (typeof minArg === 'number' && typeof maxArg === 'number') {
            return new Vector2(
                Math.max(minArg, Math.min(maxArg, this.x)),
                Math.max(minArg, Math.min(maxArg, this.y))
            );
        } else if (minArg instanceof Vector2 && maxArg instanceof Vector2) {
            return new Vector2(
                Math.max(minArg.x, Math.min(maxArg.x, this.x)),
                Math.max(minArg.y, Math.min(maxArg.y, this.y))
            );
        }
        throw new Error('Invalid clamp arguments: both min and max must be either numbers or Vector2 objects');
    }

    public clampMagnitude(maxMagnitude: number): Vector2 {
        const magnitude = this.magnitude();
        if (magnitude > maxMagnitude) {
            return this.normalise().multiply(maxMagnitude);
        }
        return this;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public lerp(target: Vector2, factor: number): Vector2 {
        return new Vector2(
            this.x + (target.x - this.x) * factor,
            this.y + (target.y - this.y) * factor
        );
    }

    public moveTowards(target: Vector2, maxDistance: number): Vector2 {
        return this.add(target.subtract(this).clampMagnitude(maxDistance));
    }

    public normalise(): Vector2 {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    public flip(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public flipx(): Vector2 {
        return new Vector2(-this.x, this.y);
    }

    public flipy(): Vector2 {
        return new Vector2(this.x, -this.y);
    }

    public round(): Vector2;
    public round(precision: number): Vector2;
    public round(xPrecision: number, yPrecision: number): Vector2;
    public round(precisionVector: Vector2): Vector2;
    public round(arg1?: number | Vector2, arg2?: number): Vector2 {
        const roundToPrecision = (value: number, precision: number): number => {
            const factor = Math.pow(10, precision);
            return Math.round(value * factor) / factor;
        };

        if (arg1 === undefined) {
            return new Vector2(roundToPrecision(this.x, 2), roundToPrecision(this.y, 2));
        } else if (typeof arg1 === 'number' && arg2 !== undefined) {
            return new Vector2(roundToPrecision(this.x, arg1), roundToPrecision(this.y, arg2));
        } else if (typeof arg1 === 'number') {
            return new Vector2(roundToPrecision(this.x, arg1), roundToPrecision(this.y, arg1));
        } else {
            return new Vector2(roundToPrecision(this.x, arg1.x), roundToPrecision(this.y, arg1.y));
        }
    }

    public stringSize(): string {
        return `${this.x}px ${this.y}px`;
    }

    equals(other: Vector2): boolean {
        return this.x === other.x && this.y === other.y;
    }
}
