import { Vector2 } from "../../util/math/vector2";
import { Character } from "./character";
import { Route } from "./route";
import { Schedule } from "./schedule";
import { TimePeriod } from "./time";


export interface TravelType {
    route: Route;
    subject: Character;
    arrivalTime: TimePeriod;
}

export class Travel {

    public leaveTime: number;
    public arrivalTime: number;
    public duration: number;
    private _active: boolean = false;
    public offset: number = 0.5;
    private stages: {
        from: Vector2;
        fromTime: number;
        to: Vector2;
        toTime: number;
        distance: number;
    }[] = [];
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    public constructor(public data: TravelType) {

    }

    build(): void {
        this.duration = this.data.route.distance / this.data.subject.speed;
        this.leaveTime = this.data.arrivalTime - this.duration + (this.duration * this.offset);
        this.arrivalTime = this.data.arrivalTime + (this.duration * this.offset);

        // this.dom = new Div({
        //     position: new Vector2(this.leaveTime * (Schedule.TASK_WIDTH * 24) / 24, 0),
        //     size: new Vector2(Schedule.TASK_WIDTH * this.duration, Schedule.TASK_HEIGHT),
        //     background: { type: 'repeat-linear', direction: '50deg', colors: [{ position: '0px', color: '#00000022' }, { position: '2px', color: 'black' }, { position: '2px', color: 'transparent' }, { position: '6px', color: 'transparent' }] },
        //     style: 'box-sizing: border-box; position: absolute;',
        // });
    }

    getTimePostion(time: number): [Vector2, number] | undefined {
        if (time > this.leaveTime && time < this.arrivalTime) {
            return this.data.route.getSegmentVector((time - this.leaveTime) * this.data.subject.speed);
        }
        return undefined;
    }
}