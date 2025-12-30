import { Vector2 } from "./vector2";

export class Utils {
    static easeColor(interval: number, from: [number, number, number, number], to: [number, number, number, number]): string {
        return `rgba(${from[0] * interval + to[0] * (1 - interval)}, ${from[1] * interval + to[1] * (1 - interval)}, ${from[2] * interval + to[2] * (1 - interval)}, ${from[3] * interval + to[3] * (1 - interval)})`;
    }
    static colorToArray(color: string): [number, number, number, number] {
        const match = color.match(/^rgba?\((\d+),(\d+),(\d+),?(\d*)?\)$/);
        if (!match) {
            throw new Error(`Invalid color: ${color}`);
        }
        return [parseInt(match[1]!), parseInt(match[2]!), parseInt(match[3]!), match[4] ? parseInt(match[4]!) : 1];
    }
    static pointInPolygon(point: Vector2, polygon: Vector2[]): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            const intersect = ((yi > point.y) != (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

}