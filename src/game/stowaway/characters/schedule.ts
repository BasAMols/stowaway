import { Vector2 } from "../../util/math/vector2";
import { Task, TaskType } from "./task";
import { TimePeriod } from "./time";
import { Travel } from "./travel";
import { MapLocation } from "./map/mapLocation";
import { IdleTask } from "./list";
import { Character } from "./character";

export interface ScheduleType {
    tasks?: (TaskType | Task)[];
}

export class Schedule {
    public static readonly TASK_WIDTH = 30;
    public static readonly TASK_HEIGHT = 30;

    protected table: Record<TimePeriod, Task>;
    protected taskList: Task[] = [];
    protected travels: Travel[] = [];


    public constructor(public person: Character, public data: ScheduleType = {}) {

        if (data.tasks) for (const task of data.tasks) {
            this.addTask(task);
        }
    }

    addTask(task: Task | TaskType): void {
        if (task instanceof Task) {
            this.taskList.push(task);
        } else {
            this.taskList.push(new Task(task));
        }
    }

    createIdleTask(start: TimePeriod, end: TimePeriod, location: MapLocation): Task {
        return new IdleTask({
            start,
            end,
            location,
        });
    }

    checkTasks() {
        const tempTable: Record<number, Task> = {};
        let lastLocation: MapLocation;
        let idleTask: Task;
        for (let i: TimePeriod = 0; (i as TimePeriod) < 24; (i as TimePeriod)++) {

            const tasks = this.taskList.filter(task => task.data.start <= i && task.data.end > i);

            if (tasks.length === 0) {
                if (!idleTask) {
                    idleTask = this.createIdleTask(i, (i + 1) as TimePeriod, lastLocation);
                } else {
                    idleTask.data.end = (i + 1) as TimePeriod;
                }
                tempTable[i] = idleTask;
            } else {
                if (idleTask) {
                    idleTask = null;
                }
                tempTable[i] = tasks[0];
                lastLocation = tasks[0].data.location;
            }
        }

        this.table = tempTable as Record<TimePeriod, Task>;
    }

    checkTravels() {
        for (let i: TimePeriod = 0; i < 24; i++) {
            const from = this.table[i as TimePeriod];
            const to = this.table[(((i + 1) % 24) as TimePeriod)];
            const route = $.routeManager.findRoute(
                from.data.location,
                to.data.location);
            const travel = route.createTravel(this.person, (i + 1) as TimePeriod);

            if (from.data.priority === to.data.priority) {
                travel.offset = 0.5;
            } else if (from.data.priority === 0) {
                travel.offset = 0;
            } else if (to.data.priority === 0) {
                travel.offset = 1;
            } else {
                travel.offset = 0.5 + (from.data.priority / 2) - (to.data.priority / 2);
            }

            travel.build();
            this.travels.push(travel);
        }
    }

    build(): void {
        this.checkTasks();
        for (const task of Object.values(this.table)) {
            task.build();
        }
        this.checkTravels();


    }

    private getTaskAtTime(time: number): Task {
        return this.table[Math.floor(time % 24) as TimePeriod];
    }

    getInfoAtTime(): { phase: 'idle' | 'travel' | 'task', position: Vector2, depth: number, task: Task | undefined } {

        for (const travel of this.travels) {
            const d = travel.getTimePostion($.time);
            if (d) {
                return { phase: 'travel', position: d[0], depth: d[1], task: undefined };
            }
        }

        const task = this.getTaskAtTime($.time);
        return { phase: 'task', position: task?.getLocation() ?? new Vector2(0, 0), depth: task?.getDepth() ?? 1, task: task };
    }
}