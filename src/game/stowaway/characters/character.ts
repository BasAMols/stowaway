import { Canvas } from "src/game/util/canvas/canvas";
import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { TaskType, Task } from "./task";
import { Schedule } from "./schedule";
import { SubCanvas } from "src/game/util/canvas/subCanvas";

export class StaticSheet extends SubCanvas {
    constructor(size: Vector2, private grid: [number, number]) {
        super(size);
    }
    subCanvas: SubCanvas;
    _value: number = 0;

    flip: boolean = false;
    value: number = 0;

    lastRender: {
        value: number;
        flip: boolean;
    }

    renderTile(image: HTMLImageElement, start: [number, number], size: [number, number]) {

        if (start[0] + size[0] > this.grid[0] || start[1] + size[1] > this.grid[1]) {
            throw new Error('Tile out of bounds');
        }

        this.subCanvas.ctx.drawImage(
            image,
            0,
            0,
            size[0] * this.size.x,
            size[1] * this.size.y,
            start[0] * this.size.x,
            start[1] * this.size.y,
            size[0] * this.size.x,
            size[1] * this.size.y,
        );

    }
}

export class CharacterSprite {
    constructor(private image: HTMLImageElement, private size: Vector2, private grid: [number, number]) {
        this.subCanvas = new SubCanvas(size);
    }
    subCanvas: SubCanvas;
    _value: number = 0;

    flip: boolean = false;
    value: number = 0;

    lastRender: {
        value: number;
        flip: boolean;
    }

    render() {

        if (this.lastRender && this.lastRender.value === this.value && this.lastRender.flip === this.flip) {
            return;
        }
        this.lastRender = {
            value: this.value,
            flip: this.flip,
        };

        this.subCanvas.clear();
        this.subCanvas.save();

        const column = this.value % this.grid[0];
        const row = Math.floor(this.value / this.grid[1]);

        if (this.flip) {
            this.subCanvas.scale(new Vector2(-1, 1));
            this.subCanvas.move(new Vector2(-this.size.x, 0));
        }

        this.subCanvas.ctx.drawImage(
            this.image,
            column * this.size.x,
            row * this.size.y,
            this.size.x,
            this.size.y,
            0,
            0,
            this.size.x,
            this.size.y,
        );
        this.subCanvas.restore();

    }
}

export interface CharacterType {
    name: string;
    tasks?: (TaskType | Task)[];
}

export class Character extends CVE {
    schedule: Schedule;
    activeTask: Task;
    direction: Vector2;
    lastPosition: Vector2 = new Vector2(0, 0);
    speed: number = 700;
    sprite: CharacterSprite;

    constructor(public data: CharacterType) {
        super();
        this.schedule = new Schedule(this, {
            tasks: data.tasks,
        });
        void $.loader.loadImage('dist/spa/images/ani/m/walk.png').then(image => {
            this.sprite = new CharacterSprite(image, new Vector2(64, 135), [5, 4])
        });
    }

    preTransform() {

        const info = this.schedule.getInfoAtTime();
        this.activeTask = info.task;
        const lastPosition = this.lastPosition;
        if (lastPosition.subtract(info.position).magnitude() > 0) {
            this.direction = info.position.subtract(lastPosition).normalise();
            this.sprite.value = 0;
        } else {
            this.direction = undefined;
            this.sprite.value = 6;
        }

        this.transform.setPosition(info.position);
        this.lastPosition = info.position;
        this.order = info.depth;

        if (this.direction) {
            this.sprite.flip = this.direction.x < 0;
        }
        this.sprite.render();

    }
    render() {
        // $.canvas.draw.rect(new Vector2(-10, -50), new Vector2(20, 50), '#fff');
        $.canvas.draw.canvas(this.sprite.subCanvas, new Vector2(-15, -60), 0.55);
    }
}