import { Vector2 } from './vector2';

export class MathUtil {
    // Max method overloads
    static max(a: number, b: number): number;
    static max(a: Vector2, b: Vector2): Vector2;
    static max(a: number | Vector2, b: number | Vector2): number | Vector2 {
        if (typeof a === 'number' && typeof b === 'number') {
            return a > b ? a : b;
        } else if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                a.x > b.x ? a.x : b.x,
                a.y > b.y ? a.y : b.y
            );
        }
        throw new Error('Invalid max arguments: both arguments must be either numbers or Vector2 objects');
    }
    
    // Min method overloads
    static  min(a: number, b: number): number;
    static min(a: Vector2, b: Vector2): Vector2;
    static min(a: number | Vector2, b: number | Vector2): number | Vector2 {
        if (typeof a === 'number' && typeof b === 'number') {
            return a < b ? a : b;
        } else if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                a.x < b.x ? a.x : b.x,
                a.y < b.y ? a.y : b.y
            );
        }
        throw new Error('Invalid min arguments: both arguments must be either numbers or Vector2 objects');
    }
    
    // Clamp method overloads
    static clamp(value: number, min: number, max: number): number;
    static clamp(value: Vector2, min: Vector2, max: Vector2): Vector2;
    static clamp(value: number | Vector2, min: number | Vector2, max: number | Vector2): number | Vector2 {
        if (typeof value === 'number' && typeof min === 'number' && typeof max === 'number') {
            return this.max(min, this.min(value, max)) as number;
        } else if (value instanceof Vector2 && min instanceof Vector2 && max instanceof Vector2) {
            return new Vector2(
                (this.max(min.x, this.min(value.x, max.x)) as number),
                (this.max(min.y, this.min(value.y, max.y)) as number)
            );
        }
        throw new Error('Invalid clamp arguments: all arguments must be either numbers or Vector2 objects');
    }
    
    // Lerp method overloads
    static lerp(a: number, b: number, t: number): number;
    static lerp(a: Vector2, b: Vector2, t: number): Vector2;
    static lerp(a: number | Vector2, b: number | Vector2, t: number): number | Vector2 {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + (b - a) * t;
        } else if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                a.x + (b.x - a.x) * t,
                a.y + (b.y - a.y) * t
            );
        }
        throw new Error('Invalid lerp arguments: a and b must be either both numbers or both Vector2 objects');
    }
}