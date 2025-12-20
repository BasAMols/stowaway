import { Vector2 } from "./math/vector2";

export function PathCreator(start: Vector2, ...d: ({
    point: Vector2,
} | {
    point: Vector2,
    controlA: Vector2,
    controlB: Vector2,
} | {
    point: Vector2,
    control: Vector2
} | {
    // arc
    point: Vector2,
    radius: number,
    startAngle: number,
    endAngle: number,
    largeArcFlag: boolean,
    sweepFlag: boolean,
})[]) {

    let path = `M ${start.x} ${start.y}`;
    for (const segment of d) {
        if ('controlA' in segment) {
            path += `C ${segment.controlA.x} ${segment.controlA.y} ${segment.controlB.x} ${segment.controlB.y} ${segment.point.x} ${segment.point.y}`;
        } else if ('control' in segment) {
            path += `Q ${segment.control.x} ${segment.control.y} ${segment.point.x} ${segment.point.y}`;
        } else if ('radius' in segment) {
            path += `A ${segment.radius} ${segment.radius} 0 ${segment.largeArcFlag ? 1 : 0} ${segment.sweepFlag ? 1 : 0} ${segment.point.x} ${segment.point.y}`;
        } else {
            path += `L ${segment.point.x} ${segment.point.y}`;
        }
    }
    return path;
}