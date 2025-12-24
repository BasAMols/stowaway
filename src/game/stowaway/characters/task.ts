import { Vector2 } from "../../util/math/vector2";
import { MapLocation } from "./map/mapLocation";
import { Schedule } from "./schedule";
import { TimePeriod } from "./time";

export interface TaskType {
    name: string;
    location: MapLocation;
    start: TimePeriod;
    end: TimePeriod;
    color?: string;
    priority?: number;
    depth?: number;
    animationStart?: number;
    animationDuration?: number;
    animationOffset?: Vector2;
    animationSpeed?: number;
}

export class Task {
    public constructor(public data: TaskType) {
        this.data.priority = this.data.priority ?? 0.5;
        if (!this.data.depth) {
            this.data.depth = this.data.location.data.depth;
        }
        this.data.animationStart = this.data.animationStart ?? 50;
        this.data.animationDuration = this.data.animationDuration ?? 6;
        this.data.animationOffset = this.data.animationOffset ?? new Vector2(0, 0);
        this.data.animationSpeed = this.data.animationSpeed ?? 200;
    }
    build(): void {
        // this.dom = new Div({
        //     size: new Vector2(Schedule.TASK_WIDTH * (this.data.end - this.data.start), Schedule.TASK_HEIGHT),
        //     background: { color: this.data.color || 'white' },
        //     style: 'display: flex; align-items: center; justify-content: center; font-size: 10px; font-family: "Arial", sans-serif; padding: 12.5px 3px; border: 1px solid black; overflow: hidden; box-sizing: border-box; position: absolute;',
        //     text: this.data.name,
        // })
    }

    getLocation(): Vector2 {
        return this.data.location.data.position;
    }
    getDepth(): number {
        return this.data.depth;
    }
}