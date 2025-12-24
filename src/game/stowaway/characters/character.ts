import { Canvas } from "src/game/util/canvas/canvas";
import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { TaskType, Task } from "./task";
import { Schedule } from "./schedule";

export interface CharacterType {
    name: string;
    tasks?: (TaskType | Task)[];
}
export type characterPhase = 'idle' | 'travel' | 'task';
export class Character extends CVE {
    schedule: Schedule;
    phase: characterPhase = 'idle';
    activeTask: Task;
    direction: Vector2;
    lastPosition: Vector2 = new Vector2(0, 0);
    speed: number = 500;

    constructor(public data: CharacterType) {
        super();
        this.schedule = new Schedule(this, {
            tasks: data.tasks,
        });
    }
    preTransform() {

        const info = this.schedule.getInfoAtTime();
        this.phase = info.phase;
        this.activeTask = info.task;
        const lastPosition = this.lastPosition;
        if (lastPosition.subtract(info.position).magnitude() > 0) {
            this.direction = info.position.subtract(lastPosition).normalise();
        } else {
            this.direction = undefined;
        }

        this.transform.setPosition(info.position);
        this.lastPosition = info.position;
        this.order = info.depth;
    }
    render() {
        $.canvas.draw.rect(new Vector2(-10, -50), new Vector2(20, 50), '#fff');
    }
}